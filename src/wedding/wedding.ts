import {
  blob,
  bool,
  Canister,
  ic,
  nat,
  nat64,
  None,
  Opt,
  Principal,
  query,
  Record,
  Result,
  Some,
  StableBTreeMap,
  text,
  update, Vec,
  Void,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';
import { zodiacTable, zodiacSigns, compatibilityTable } from './zodiacCompatibility';

// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const weddingRecord = {
  id: text,
  partner1: Principal,
  partner2: Opt(Principal),
  hadAt: nat,
  isRejected: bool,
  isPaid: bool,
};

const Wedding = Record(weddingRecord);

const Ring = Record({
  tokenId: Opt(nat64),
  data: text,
});

const Partner = Record({
  id: Principal,
  name: text,
  wedding: text,
  isAgreed: bool,
  ring: Opt(Ring),
  isWaiting: bool,
});

const WeddingInfo = Record({
  ...weddingRecord,
  partner1: Partner,
  partner2: Opt(Partner),
});

const CompatibilityResult = Record({
  compatibility: text,
  strengths: Vec(text),
  weaknesses: Vec(text),
});

const Certificate = Record({
  token_id: nat64,
  weddingId: text,
});

let weddings = StableBTreeMap(text, Wedding, 1)!;

let partners = StableBTreeMap(Principal, Partner, 2)!;

let certificates = StableBTreeMap(text, Certificate, 3)!;

let getWeddingInfoHandler = (principal) => {
  console.log(`getting wedding info`);
  const maybePartner = partners.get(principal);
  if ('None' in maybePartner) {
    console.log('partner not found');
    return None;
  }
  const partner = maybePartner.Some;
  const wedding = weddings.get(partner.wedding).Some!;
  console.log(`getWeddingInfo: ${JSON.stringify(wedding)}`);

  let partner1: typeof Partner;
  let partner2: Opt<typeof Partner>;
  if (principal.compareTo(wedding.partner1) === 'eq') {
    partner1 = partner;
    if ('Some' in wedding.partner2) {
      partner2 = partners.get(wedding.partner2.Some!);
    } else {
      partner2 = None;
    }
  } else {
    partner1 = partners.get(wedding.partner1).Some!;
    partner2 = Some(partner);
  }

  return Some(
    { ...wedding, partner1, partner2 }, // as any
  );
};

let getPartnerInfoHandler = (partnerPrincipal) => {
  return partners.get(partnerPrincipal);
};

let getAppVersionHandler = () => {
  const pj = require('./package.json');
  return pj.version;
};

const canister_ids = require('../../.dfx/local/canister_ids.json');

export const nftCanisterId = canister_ids['dip721_nft_container'].local as string;
export const weddingCanisterId = canister_ids['wedding'].local as string;

const weddingPrincipal = Principal.fromText(weddingCanisterId);

const NftCanister = Canister({
  is_custodian: query([Principal], bool),
  // DO NOT REMOVE! REMOVING THIS USELESS METHOD WILL BREAK THE NEXT METHOD CALL
  set_custodian: update([Principal, bool], Result),
  mintDip721_text: update([Principal, text, blob], text),
});

const nftCanister = NftCanister(Principal.fromText(nftCanisterId));

const RejectProposalInput = Record({
  weddingId: text,
});

let rejectProposalHandler = (input) => {
  console.log(`input: ${JSON.stringify(input)}`);
  let weddingId = input.weddingId;
  let maybeWedding = weddings.get(weddingId);
  if ('None' in maybeWedding) {
    console.log('wedding not found by id: ' + weddingId.toString());
    return;
  }
  let wedding = maybeWedding.Some!;
  if ('Some' in wedding.partner2) {
    console.log('proposal is already accepted');
    return;
  }
  wedding.isRejected = true;
  weddings.insert(weddingId, wedding);
  console.log('proposal is rejected');
};

const AcceptProposalInput = Record({
  weddingId: text,
  proposeeName: text,
});

let acceptProposalHandler = (input) => {
  console.log(`input: ${JSON.stringify(input)}`);
  let principal = ic.caller();
  let weddingId = input.weddingId;
  let maybeWedding = weddings.get(weddingId);
  if ('None' in maybeWedding) {
    console.log('wedding not found by id: ' + weddingId.toString());
    return;
  }
  let wedding = maybeWedding.Some!;
  if (wedding.partner1.compareTo(principal) === 'eq') {
    console.log(`partner1 and partner2 are identical`);
    //return;
  }
  const partner = {
    id: principal,
    name: input.proposeeName,
    wedding: weddingId,
    isAgreed: false,
    ring: None,
    isWaiting: false,
  };
  wedding.partner2 = Some(principal);
  weddings.insert(weddingId, wedding);
  partners.insert(principal, partner);
  console.log('accepted!');
};

const CreateWeddingInput = Record({
  proposerName: text,
});

let createWeddingHandler = (input) => {
  console.log(`input: ${JSON.stringify(input)}`);
  let principal = ic.caller();
  console.log(`principal: ${principal.toString()}`);
  let maybePartner = partners.get(principal);
  if ('None' in maybePartner) {
    const weddingId = uuidv4();
    console.log('partner not found, creating one');
    const partner = {
      id: principal,
      name: input.proposerName,
      wedding: weddingId,
      isAgreed: false,
      ring: None,
      isWaiting: false,
    };
    partners.insert(partner.id, partner);
    console.log('wedding would be created: ' + weddingId.toString());
    const wedding: typeof Wedding = {
      id: weddingId,
      partner1: principal,
      partner2: None,
      hadAt: ic.time(),
      isRejected: false,
      isPaid: false,
    };
    weddings.insert(weddingId, wedding);
    return Some(weddingId);
  } else {
    // if wedding exist and is rejected - create new one
    let partner = maybePartner.Some!;
    let wedding = weddings.get(partner.wedding).Some!;
    if (wedding.isRejected) {
      const weddingId = uuidv4();
      console.log(`wedding ${weddingId.toString()} would be created instead of rejected ${partner.wedding.toString()}`);
      const wedding: typeof Wedding = {
        id: weddingId,
        partner1: principal,
        partner2: None,
        hadAt: ic.time(),
        isRejected: false,
        isPaid: false,
      };
      partner.ring = None;
      weddings.insert(weddingId, wedding);
      partners.insert(partner.id, partner);
      return Some(weddingId);
    } else {
      console.log(`wedding already exists`);
      return Some(wedding.id);
    }
  }
};

let setCertificateHandler = async (weddingId: text) => {
  const caller = ic.caller();
  const u8arr = Uint8Array.from(Buffer.from(weddingId));
  const rawArg = eval('`[{"data":[${u8arr}],"purpose":"Rendered","key_val_data":{}}]`');

  try {
    const maybeWedding = weddings.get(weddingId);
    if ('None' in maybeWedding) {
      console.log('Wedding not found');
      return;
    }

    let certificate: typeof Certificate;

    const maybeCertificate = certificates.get(weddingId);
    if ('None' in maybeCertificate) {
      const maybePartner = partners.get(caller);
      if ('None' in maybePartner) {
        console.log(`partner not found`);
        return;
      }

      const result = await ic.call(nftCanister.mintDip721_text, {
        args: [weddingPrincipal, rawArg, []],
      });
      console.log('result: ' + JSON.stringify(result));

      const obj = JSON.parse((result as String).toString());
      if (obj.hasOwnProperty('Err')) {
        console.log('error!');
        return;
      }
      certificate = {
        token_id: BigInt(obj['Ok']['token_id']),
        weddingId: weddingId,
      };
      certificates.insert(weddingId, certificate);
    } else {
      certificate = maybeCertificate.Some!;
    }

    console.log('certificate ' + certificate);
  } catch (error) {
    console.log(error);
  }
};

const SetRingInput = Record({
  ringBase64: text,
});

let setRingHandler = async (input) => {
  let caller = ic.caller();
  let maybePartner = partners.get(caller);
  if ('None' in maybePartner) {
    console.log(`partner not found`);
    return;
  }
  let partner = maybePartner.Some!;
  if ('Some' in partner.ring) {
    console.log('ring already exists, token_id: ' + partner.ring.Some!.tokenId);
    return;
  }
  const ring: typeof Ring = {
    tokenId: None,
    data: input.ringBase64,
  };
  partner.ring = Some(ring);
  partners.insert(partner.id, partner);
};

let setPartnerWaitingHandler = () => {
  const partnersOpt = partners.get(ic.caller());
  if ('None' in partnersOpt) {
    ic.trap('Please call a match method first');
    return;
  }
  const partner = partnersOpt.Some;
  partner.isWaiting = true;
  partners.insert(partner.id, partner);
};

let updatePartnerNameHandler = (partnerName: text) => {
  const partnersOpt = partners.get(ic.caller());
  if ('None' in partnersOpt) {
    ic.trap('No such partner');
    return;
  }
  const partner = partnersOpt.Some;
  partner.name = partnerName;
  partners.insert(partner.id, partner);
};

let payHandler = async () => {
  let principal = ic.caller();
  console.log(`principal: ${principal.toString()}`);
  let maybePartner = partners.get(principal);
  if ('None' in maybePartner) {
    console.log(`partner not found ${principal.toString()}`);
    return;
  }
  let maybeWedding = weddings.get(maybePartner.Some!.wedding);
  if ('None' in maybeWedding) {
    console.log(`wedding not found ${principal.toString()}`);
    return;
  }
  let wedding = maybeWedding.Some!;

  let partner = partners.get(wedding.partner1).Some!;
  await mintPartnersRingAndUpdate(partner);
  partner = partners.get(wedding.partner2.Some!).Some!;
  await mintPartnersRingAndUpdate(partner);

  wedding.isPaid = true;
  weddings.insert(wedding.id, wedding);
  console.log(`wedding ${wedding.id.toString()} is paid`);
};

let mintPartnersRingAndUpdate = async (partner: typeof Partner) => {
  if ('None' in partner.ring) {
    throw `ring is not defined for partner: ${partner.id}`;
  }
  let ring = partner.ring.Some!;
  let u8arr = Uint8Array.from(Buffer.from(partner.ring.Some!.data));
  let rawArg = eval('`[{"data":[${u8arr}],"purpose":"Rendered","key_val_data":{}}]`');
  console.log('str: ' + rawArg);
  let result = await ic.call(nftCanister.mintDip721_text, {
    args: [weddingPrincipal, rawArg, []],
  });
  console.log('result: ' + JSON.stringify(result));
  let obj = JSON.parse((result as String).toString());
  if (obj.hasOwnProperty('Err')) {
    console.log('error!');
    return;
  }
  let tokenId = obj['Ok']['token_id'];
  console.log(`minted ring token: ${tokenId}`);
  ring.tokenId = tokenId;
  partner.ring = Some(ring);
  partners.insert(partner.id, partner);
};

let agreeToMarryHandler = () => {
  const partnersOpt = partners.get(ic.caller());
  if ('None' in partnersOpt) {
    ic.trap('No such partner');
    return;
  }
  const partner = partnersOpt.Some;
  partner.isAgreed = true;
  partners.insert(partner.id, partner);
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

  const zodiac_compatibility = zodiacTable[zodiacSign1][zodiacSign2];

  const lifePathNumber1 = calcLifePathNumber(dateOfBirth1);
  const lifePathNumber2 = calcLifePathNumber(dateOfBirth2);
  const lifePathNumberCompatibility = compatibilityTable[`${lifePathNumber1},${lifePathNumber2}`]
    || compatibilityTable[`${lifePathNumber2},${lifePathNumber1}`]
    || 'Neutral Compatibility';

  return Some({
    compatibility: lifePathNumberCompatibility,
    strengths: zodiac_compatibility.strengths,
    weaknesses: zodiac_compatibility.weaknesses,
  });
};

export default Canister({
  createWedding: update([CreateWeddingInput], Opt(text), createWeddingHandler),
  updatePartnerName: update([text], Void, updatePartnerNameHandler),
  acceptProposal: update([AcceptProposalInput], Void, acceptProposalHandler),
  rejectProposal: update([RejectProposalInput], Void, rejectProposalHandler),

  getPartnerInfo: query([Principal], Opt(Partner), getPartnerInfoHandler),
  getWeddingInfoOf: query([Principal], Opt(WeddingInfo), getWeddingInfoHandler),

  setRing: update([SetRingInput], Void, setRingHandler),
  getAppVersion: query([], text, getAppVersionHandler),

  setPartnerWaiting: update([], Void, setPartnerWaitingHandler),
  pay: update([], Void, payHandler),

  setCertificate: update([text], Void, setCertificateHandler),
  agreeToMarry: update([], Void, agreeToMarryHandler),

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
