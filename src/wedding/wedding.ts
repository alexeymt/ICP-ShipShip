import {
  blob,
  bool,
  Canister,
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
import { zodiacTable, zodiacSigns } from './zodiacCompatibility';

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

const Ring = Record({
  token_id: nat64,
  data: text
})

const WeddingInfo = Record({
  ...weddingRecord,
  partner1: Partner,
  ring1: Ring,
  partner2: Partner,
  ring2: Ring
});

const CompatibilityResult = Record({
  compatibility: text,
  strengths: Vec(text),
  weaknesses: Vec(text),
});

let weddings = StableBTreeMap(text, Wedding, 1)!;

let partners = StableBTreeMap(Principal, Partner, 2)!;

let rings = StableBTreeMap(Principal, Ring, 3)!;

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
      ring: None,
      isAgreed: false,
    };
    partners.insert(partner1.id, partner1);
    const partner2 = {
      id: partnerPrincipal,
      name: None,
      wedding: wedding.id,
      ring: None,
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
  let ring1: typeof Ring;
  let ring2: typeof Ring;
  if (partnerPrinciple.compareTo(wedding.partner1) === 'eq') {
    partner1 = partner;
    partner2 = partners.get(wedding.partner2).Some!;
  } else {
    partner2 = partner;
    partner1 = partners.get(wedding.partner1).Some!;
  }
  ring1 = rings.get(partner1.id).Some!
  ring2 = rings.get(partner2.id).Some!
  return Some(
      { ...wedding, partner1, ring1, partner2, ring2}, // as any
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
  // DO NOT REMOVE! REMOVING THIS USELESS METHOD WILL BREAK THE NEXT METHOD CALL
  set_custodian: update([Principal, bool], Result),
  mintDip721_text: update([Principal, text, blob], text),
});

const nftCanister = NftCanister(
    Principal.fromText(nftCanisterId)
);

let mintNftHandler = async (text: string, principal: Principal) => {
  console.log('called mintNftHandler for nftCanisterId: ' + nftCanisterId)
  let u8arr = Uint8Array.from(Buffer.from(text))
  let str = eval('`[{"data":[${u8arr}],"purpose":"Rendered","key_val_data":{}}]`')
  console.log('str: ' + str)
  try {
    let maybeRing = rings.get(principal)
    if ('None' !in maybeRing) {
      console.log('ring already exists, token_id: ' + maybeRing.Some!.token_id)
    }
    let result = await ic.call(nftCanister.mintDip721_text, {
      args: [principal, str, []]
    });
    console.log('result: ' + JSON.stringify(result))
    let obj = JSON.parse((result as String).toString());
    if (obj.hasOwnProperty("Err")) {
      console.log("error!")
      return
    }
    let tokenId = obj["Ok"]["token_id"];
    const ring: typeof Ring = {
      token_id: BigInt(tokenId),
      data: text
    }
    rings.insert(principal, ring)
  } catch (error) {
    console.log(error);
  }
};

let checkCompatibilityHandler = (dateOfBirth1: text, dateOfBirth2: text) => {
  const calcLifePathNumber = (value: string) => {
    let sum = 0;

    value.split('').forEach((x) => {
      sum += parseInt(x);
    });

    if (sum > 9) {
      return calcLifePathNumber(sum.toString());
    }

      return sum;
  };

  const determineZodiacSign = (dateOfBirth: string) => {
    const month = parseInt(dateOfBirth.slice(4, 6));
    const day = parseInt(dateOfBirth.slice(6, 8));

    for (let i = 0; i < zodiacSigns.length; i++) {
        let sign = zodiacSigns[i];
        let start = sign.start;
        let end = sign.end;

        if ((month === start.month && day >= start.day) ||
            (month === end.month && day <= end.day) ||
            (month > start.month && month < end.month)) {
            return sign.sign;
        }
    }

    return null;
  };

  const zodiacSign1 = determineZodiacSign(dateOfBirth1);
  const zodiacSign2 = determineZodiacSign(dateOfBirth2);

  if (zodiacSign1 === null || zodiacSign2 === null) {
    return None;
  }

  return Some(zodiacTable[zodiacSign1][zodiacSign2]);
};

export default Canister({
  matchPartner: update([text, Principal], Void, matchPartnerHandler),
  agreeToMarry: update([], Void, agreeToMarryHandler),
  getPartnerInfo: query([Principal], Opt(Partner), getPartnerInfoHandler),
  getWeddingInfoOf: query([Principal], Opt(WeddingInfo), getWeddingInfoOfHandler),
  getAppVersion: query([], text, getAppVersionHandler),
  setRing: query([text, Principal], Void, setRingHandler),
  mintNft: update([text, Principal], Void, mintNftHandler),
  checkCompatibility: query([text, text], Opt(CompatibilityResult), checkCompatibilityHandler),
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
