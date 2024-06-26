import {
  blob,
  bool,
  Canister, Err,
  ic,
  nat, nat64,
  None,
  Opt,
  Principal,
  query,
  Record, Result,
  Some,
  StableBTreeMap,
  text,
  update, Vec,
  Void,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';
import {ApiError} from "../declarations/dip721_nft_container/dip721_nft_container.did";

// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const weddingRecord = {
  id: text,
  partner1: Principal,
  partner2: Principal,
  hadAt: nat,
};

const Wedding = Record(weddingRecord);

const Partner = Record({
  id: Principal,
  name: Opt(text),
  wedding: text,
  isAgreed: bool,
});

const WeddingInfo = Record({
  ...weddingRecord,
  partner1: Partner,
  partner2: Partner,
});

let weddings = StableBTreeMap(text, Wedding, 1)!;

let partners = StableBTreeMap(Principal, Partner, 2)!;

let agreeToMarryHandler = () => {
  const partnersOpt = partners.get(ic.caller());
  if ('None' in partnersOpt) {
    ic.trap('Please call a match method first');
    return;
  }
  const partner = partnersOpt.Some;
  if ('None' in partner.name) {
    ic.trap('Please call a match method first to accept');
    return;
  }

  partner.isAgreed = true;
  partners.insert(partner.id, partner);

  // const wedding = weddings.get(partner.wedding).Some!;
  // const partner2 = partners.get(wedding.partner2).Some!;
  // if (partner2.isAgreed) {
  //   // issue marriage certificate
  // }
};

let matchPartnerHandler = (myName, partnerPrincipal) => {
  const partnersOpt = partners.get(ic.caller());
  // match
  if ('None' in partnersOpt) {
    const wedding: typeof Wedding = {
      id: uuidv4(),
      partner1: ic.caller(),
      partner2: partnerPrincipal,
      hadAt: ic.time(),
    };
    weddings.insert(wedding.id, wedding);
    const partner1 = {
      id: ic.caller(),
      name: Some(myName),
      wedding: wedding.id,
      isAgreed: false,
    };
    partners.insert(partner1.id, partner1);
    const partner2 = {
      id: partnerPrincipal,
      name: None,
      wedding: wedding.id,
      isAgreed: false,
    };
    partners.insert(partner2.id, partner2);
  } else {
    // accept match
    const partner = partnersOpt.Some;
    partner.name = Some(myName);
    partners.insert(partner.id, partner);
  }
};

let getWeddingInfoOfHandler = (partnerPrinciple) => {
  const partnerOpt = partners.get(partnerPrinciple);
  if ('None' in partnerOpt) {
    return None;
  }
  const partner = partnerOpt.Some;
  const wedding = weddings.get(partner.wedding).Some!;
  // console.log(`getWeddingInfoOf: wedding: ${JSON.stringify(wedding)}`);

  let partner1: typeof Partner;
  let partner2: typeof Partner;
  if (partnerPrinciple.compareTo(wedding.partner1) === 'eq') {
    partner1 = partner;
    partner2 = partners.get(wedding.partner2).Some!;
  } else {
    partner2 = partner;
    partner1 = partners.get(wedding.partner1).Some!;
  }
  return Some(
      { ...wedding, partner1, partner2 }, // as any
  );
};

let getPartnerInfoHandler = (partnerPrincipal) => {
  return partners.get(partnerPrincipal);
};

let getAppVersionHandler = () => {
  const pj = require('./package.json')
  return pj.version
};

let setRingHandler = (text: string, principal: Principal) => {
  let caller = ic.caller().toText();
  let p = principal.toText();
  console.log('setting ring info: ' + text + ' for principal: ' + p + ' caller: ' + caller)
};

const canister_ids = require("../../.dfx/local/canister_ids.json");

export const nftCanisterId = canister_ids["dip721_nft_container"].local as string;


const NftCanister = Canister({
  is_custodian: query([Principal], bool),
  set_custodian: update([Principal, bool], Result),
  mintDip721_text: update([Principal, text, blob], text),
});

const nftCanister = NftCanister(
    Principal.fromText(nftCanisterId)
);

let mintNftHandler = async (text: string, principal: Principal) => {
  console.log('called mintNftHandler for nftCanisterId: ' + nftCanisterId)
  try {
    let result = await ic.call(nftCanister.mintDip721_text, {
      args: [principal, '[]', []]
    });
    console.log('result: ' + JSON.stringify(result))
  } catch (error) {
    console.log(error);
  }
};

export default Canister({
  matchPartner: update([text, Principal], Void, matchPartnerHandler),
  agreeToMarry: update([], Void, agreeToMarryHandler),
  getPartnerInfo: query([Principal], Opt(Partner), getPartnerInfoHandler),
  getWeddingInfoOf: query([Principal], Opt(WeddingInfo), getWeddingInfoOfHandler),
  getAppVersion: query([], text, getAppVersionHandler),
  setRing: query([text, Principal], Void, setRingHandler),
  mintNft: update([text, Principal], Void, mintNftHandler),
});


globalThis.crypto = {
  // @ts-expect-error Uint8Array is compatible with ArrayBufferView
  getRandomValues: () => {
    const array = new Uint8Array(32);

    for (let i = 0; i < array.length; i += 1) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
