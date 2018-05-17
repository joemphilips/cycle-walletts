import { Component } from "./interfaces";
import { Counter } from "./pages/counter";
import { Speaker } from "./pages/speaker";
import { main as TutorialList } from "./pages/tutorials/TutorialList";
import { WalletDetail } from "./pages/wallet/WalletDetail";

export interface RouteValue {
  readonly component: Component<any, any>;
  readonly scope: string;
}
export interface Routes {
  readonly [index: string]: RouteValue;
}

export const routes: Routes = {
  "/": { component: Counter, scope: "counter" },
  "/p2": { component: Speaker, scope: "speaker" },
  "/tutorial": { component: TutorialList, scope: "tutorial" },
  "/wallet": { component: WalletDetail, scope: "wallet-detail" }
};

export const initialRoute = "/";