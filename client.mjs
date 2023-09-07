import { Message, OrderStatus, Rfq, PfiRestClient, DevTools } from "@tbd54566975/tbdex"


var did = await DevTools.createDid();
console.log(did);

DevTools.createRfq();