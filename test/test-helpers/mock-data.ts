import { utils } from "ethers";
import { Entity, Permission, PermissionP } from "../../src";
import { toDecimals } from "../../src/helpers";
import { oracle, and, timestamp } from "../../src/helpers/acl";

export const resolvePermission = (permission: Permission): Permission => {
  return permission.map((element, index) => {
    // Last element is the role
    if (index === permission.length - 1) {
      return utils.id(element);
    }

    return utils.isAddress(element) ? element : DAO[element as keyof typeof DAO];
  }) as Permission;
};

export const resolveApp = (appName: string) => {
  return DAO[appName as keyof typeof DAO];
};

export const getSignatureSelector = (signature: string): string => {
  return signature.split("(")[0];
};

export const ADDRESS = "0xc125218F4Df091eE40624784caF7F47B9738086f";

export const DAO = {
  acl: "0xbec954725a866994d68b7c01f30742b42965091e",
  vault: "0x1c06257469514574c0868fdcb83c5509b5513870",
  ["disputable-voting.open"]: "0x6e60be79144609ed744d38ca4eff0105ac7ac4dc",
  ["evm-script-registry"]: "0x73778c0c3a761405bddef887535647f0441f2016",
  finance: "0x67d35c1794cfd88f652866ba82c5e11a51e90f44",
  kernel: "0x8bebd1c49336Bf491ef7bd8a7f9A5d267081b33E",
  ["token-manager"]: "0x2f3833143987136f917ff09af5970bf707ec0246",
  ["tollgate.open"]: "0x5f124b9a008f9424468addff38b98a1e5f509444",
  voting: "0xc59d4acea08cf51974dfeb422964e6c2d7eb906f",
  agent: "0x1c06257469514574c0868fdcb83c5509b5513870",
};

export const APP = {
  appName: "token-manager.aragonpm.eth",
  codeAddress: "0x64c007ba4ab6184753dc1e8e7263e8d06831c5f6",
  initializeSignature: "initialize(address,bool,uint256)",
  initializeParams: ["0x1c06257469514574c0868fdcb83c5509b5513870", false, toDecimals(1000)],
  initializeUnresolvedParams: ["vault", false, "1000e18"],
  callSignature: "mint(address,uint256)",
  callSignatureParams: [DAO.voting, toDecimals(15)],
  callSignatureUnresolvedParams: ["voting", "15e18"],
  actTarget: "0xc778417e063141139fce010982780140aa0cd5ab",
  actSignature: "approve(address[],uint256[][])",
  actSignatureParams: [["0x1c06257469514574c0868fdcb83c5509b5513870"], [[toDecimals(1000)], [String(0.15e8), 56]]],
  actSignatureUnresolvedParams: [["vault"], [["1000e18"], ["0.15e8", 56]]], // TODO: Change it with an Agent
  get appIdentifier(): keyof typeof DAO {
    return this.appName.split(".")[0] as keyof typeof DAO;
  },
  get appId(): string {
    return utils.namehash(this.appName);
  },
};

export const GRANT_PERMISSION: Permission = [
  "0xc125218F4Df091eE40624784caF7F47B9738086f",
  "token-manager",
  "MINT_ROLE",
];

export const GRANT_PERMISSION_PARAMS: PermissionP = [
  "0xc125218F4Df091eE40624784caF7F47B9738086f",
  "token-manager",
  "MINT_ROLE",
  and(oracle("0x0"), timestamp.gte(10000000)),
];

export const NEW_PERMISSION: Permission = ["voting", "token-manager", "ISSUE_ROLE"];

export const NEW_PERMISSION_PARAMS: PermissionP = [
  "voting",
  "token-manager",
  "ISSUE_ROLE",
  and(oracle("0x0"), timestamp.gte(10000000)),
];

export const NEW_PERMISSIONS: Permission[] = [
  ["voting", "token-manager", "ASSIGN_ROLE"],
  ["voting", "token-manager", "REVOKE_VESTINGS_ROLE"],
];

export const PERMISSION_MANAGER: Entity = "voting";

export const REVOKE_PERMISSION: Permission = ["voting", "finance", "MANAGE_PAYMENTS_ROLE"];

export const REVOKE_PERMISSIONS: Permission[] = [
  ["voting", "finance", "CREATE_PAYMENTS_ROLE"],
  ["voting", "voting", "MODIFY_SUPPORT_ROLE"],
];

export const FORWARDER = "token-manager";
export const FEE_FORWARDER = "tollgate.open";
export const CONTEXT_FORWARDER = "disputable-voting.open";

export const COMPLETE_FORWARDER_PATH = [FEE_FORWARDER, FORWARDER, CONTEXT_FORWARDER];

export const CONTEXT = "Example Context";

export const FEE_AMOUNT = toDecimals(1);
export const FEE_TOKEN_ADDRESS = "0x0527E400502d0CB4f214dd0D2F2a323fc88Ff924";