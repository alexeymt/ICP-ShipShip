import {
  bool,
  Canister,
  ic,
  nat,
  None,
  Opt,
  Principal,
  query,
  Record,
  Some,
  StableBTreeMap,
  text,
  update,
  Void,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

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
  isWaiting: bool,
  isAgreed: bool,
  isRejected: bool,
  isPaid: bool,
});

const WeddingInfo = Record({
  ...weddingRecord,
  partner1: Partner,
  partner2: Partner,
});

let weddings = StableBTreeMap(text, Wedding, 1)!;

let partners = StableBTreeMap(Principal, Partner, 2)!;

export default Canister({
  matchPartner: update([text, Principal, text], Void, (myName, partnerPrincipal, partnerName) => {
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
        isWaiting: false,
        isAgreed: false,
        isRejected: false,
        isPaid: false,
      };
      partners.insert(partner1.id, partner1);
      const partner2 = {
        id: partnerPrincipal,
        name: Some(partnerName),
        wedding: wedding.id,
        isWaiting: false,
        isAgreed: false,
        isRejected: false,
        isPaid: false,
      };
      partners.insert(partner2.id, partner2);
    } else {
      // accept match
      const partner = partnersOpt.Some;
      partner.name = Some(myName);
      partners.insert(partner.id, partner);
    }
  }),

  rejectMarry: update([], Void, () => {
    const partnersOpt = partners.get(ic.caller());
    if ('None' in partnersOpt) {
      ic.trap('Match method not called');
      return;
    }
    const partner = partnersOpt.Some;
    if ('None' in partner.name) {
      ic.trap('Match method not called');
      return;
    }

    partner.isRejected = true;
    partners.insert(partner.id, partner);
  }),

  setPartnerWaiting: update([], Void, () => {
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

    partner.isWaiting = true;
    partners.insert(partner.id, partner);
  }),

  setPartnerPaid: update([], Void, () => {
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

    partner.isPaid = true;
    partners.insert(partner.id, partner);
  }),

  agreeToMarry: update([], Void, () => {
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
  }),

  getPartnerInfo: query([Principal], Opt(Partner), (partnerPrincipal) => {
    return partners.get(partnerPrincipal);
  }),

  getWeddingInfoOf: query([Principal], Opt(WeddingInfo), (partnerPrinciple) => {
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
  }),

  getAppVersion: query([], text, () => {
    const pj = require('./package.json');
    return pj.version;
  }),
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
