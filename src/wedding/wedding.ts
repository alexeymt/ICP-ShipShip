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
  wedding: Opt(text),
  proposal: Opt(text),
  isAgreed: bool,
});

const ProposalInput = Record({
  proposerName: text,
  proposeeName: text,
})

let proposalRecord = {
  id: text,
  proposerId: Principal,
  proposeeName: text,
  isAccepted: Opt(bool),
};
const Proposal = Record(proposalRecord)

const ProposalInfo = Record ({
  ...proposalRecord,
  proposerPartner: Partner,
})

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

let weddings = StableBTreeMap(text, Wedding, 1)!;

let partners = StableBTreeMap(Principal, Partner, 2)!;

let rings = StableBTreeMap(Principal, Ring, 3)!;

let proposalById = StableBTreeMap(text, Proposal, 4)!;
let proposalByPrincipal = StableBTreeMap(Principal, text, 5)!;

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
      proposal: None,
      wedding: Some(wedding.id),
      ring: None,
      isAgreed: false,
    };
    partners.insert(partner1.id, partner1);
    const partner2 = {
      id: partnerPrincipal,
      name: None,
      proposal: None,
      wedding: Some(wedding.id),
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

let getWeddingInfoOfHandler = (principal) => {
  const partnerOpt = partners.get(principal);
  if ('None' in partnerOpt) {
    return None;
  }
  const partner = partnerOpt.Some;
  const wedding = weddings.get(partner.wedding.Some!).Some!;
  // console.log(`getWeddingInfoOf: wedding: ${JSON.stringify(wedding)}`);

  let partner1: typeof Partner;
  let partner2: typeof Partner;
  let ring1: typeof Ring;
  let ring2: typeof Ring;
  if (principal.compareTo(wedding.partner1) === 'eq') {
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

let createProposalHandler = (input) => {
  const proposer = ic.caller();
  let maybeProposalsByPrincipal = proposalByPrincipal.get(proposer);
  if ('Some' in maybeProposalsByPrincipal) {
    let proposalId = maybeProposalsByPrincipal.Some!;
    console.log('proposal already exists with id: ' + proposalId)
    try {
      let maybeProposal = proposalById.get(proposalId)
      console.log('proposal: ' + JSON.stringify(maybeProposal))
      if ('None' in maybeProposal.Some!.isAccepted) {
        console.log('but without acceptance status yet, new proposal would not be created'.toString())
        return Some(proposalId)
      }
    } catch (error) {
      console.log(error);
      return None
    }
  }
  let id = uuidv4();
  console.log('proposal would be created with id: ' + id.toString())
  const maybePartner = partners.get(proposer);
  if ('None' in maybePartner) {
    console.log("partner not found by principal: " + proposer.toText() + ", creating a new one...")
    const partner = {
      id: proposer,
      name: Some(input.proposerName),
      wedding: None,
      proposal: Some(id),
      ring: None,
      isAgreed: false,
    };
    partners.insert(proposer, partner)
    console.log("created partner: " + JSON.stringify(partner))
  }
  let proposal = {
    id: id,
    proposerId: proposer,
    proposeeName: input.proposeeName,
    isAccepted: None,
  }
  proposalById.insert(id, proposal)
  proposalByPrincipal.insert(proposer, id)
  console.log("created proposal: " + JSON.stringify(proposal))
  return Some(id)
}

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

let getProposalByIdHandler = (text: string) => {
  let maybeProposal = proposalById.get(text)
  if ('None' in maybeProposal) {
    return None
  }
  let proposal = maybeProposal.Some!
  let proposerPartner = partners.get(proposal.proposerId).Some!
  return Some({
    ...proposal,
    proposerPartner: proposerPartner
  })
}

let rejectProposalHandler = (text: string) => {
  changeProposalAcceptance(text, false)
}

let acceptProposalHandler = (text: string) => {
  changeProposalAcceptance(text, true)
}

let changeProposalAcceptance = (text: string, isAccepted: boolean) => {
  console.log('changing proposal : ' + text + ' acceptance to: ' + isAccepted)
  let maybeProposal = proposalById.get(text)
  if ('None' in maybeProposal) {
    console.log('proposal not found')
    return;
  }
  let proposal = maybeProposal.Some!
  if ('Some' in proposal.isAccepted) {
    console.log('proposal already accepted or rejected: ' + proposal.isAccepted)
    return;
  }
  proposal.isAccepted = Some(isAccepted)
  proposalById.insert(proposal.id, proposal)
  console.log('proposal acceptance status has  been hanged to: ' + isAccepted.valueOf())
}

export default Canister({
  matchPartner: update([text, Principal], Void, matchPartnerHandler),
  agreeToMarry: update([], Void, agreeToMarryHandler),
  getPartnerInfo: query([Principal], Opt(Partner), getPartnerInfoHandler),
  getWeddingInfoOf: query([Principal], Opt(WeddingInfo), getWeddingInfoOfHandler),
  getAppVersion: query([], text, getAppVersionHandler),
  mintNft: update([text, Principal], Void, mintNftHandler),
  createProposal: update([ProposalInput], Opt(text), createProposalHandler),
  getProposalById: query([text], Opt(ProposalInfo), getProposalByIdHandler),
  rejectProposal: update([text], Void, rejectProposalHandler),
  acceptProposal: update([text], Void, acceptProposalHandler),
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
