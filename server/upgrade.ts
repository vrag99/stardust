import { Call, CallData } from "starknet";
import { getOutsideCall } from "./outsideExecution";

export function getUpgradeData(calls: Call[]) {
  const externalCalls = calls.map(getOutsideCall);
  return CallData.compile({ externalCalls });
}

export function getUpgradeDataLegacy(calls: Call[]) {
  const upgradeData = getUpgradeData(calls);
  return CallData.compile({ upgradeData });
}
