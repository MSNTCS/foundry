// Copyright 2019 Kodebox, Inc.
// This file is part of CodeChain.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { SDK } from "../src/sdk";
import { Signer } from "../src/helper/spawn";

const privateKeys = [
  "df7fc69a4dee82b9efa6d48d45dc1b541c54eb61e3af5acf577f07cdb706aa1d9871a148fbc474f82ad1c93140b9a24b7c2e8944158816bab6f828c5f4502461",
   // tccqy3559prpzths7q2prztzn4kh3suj97ecs356ygc
  "be173d1f8b1f76b8ae0d15bd6c4beeb664ef12655310dd04c36945dc86b075a1dc7d598adaea461bf3c85ae727ae9d653d315f07099a200d5fbef49b3ffd5d25",
  // tccq9lseysjk6eg803u7pzxm3j7h5kc36l5gylnkrp4
  "e24f42d28d82a13b2031397df561cf1066b3eeaa959fa2a4de763e657efb3926bc7729f91c57f575c9555db790a979ef8143ea29488f3b5e498e3c2c00b1d391",
  // tccq9qlkwmawatnqqaztcd6tx2cmjqkc52ytcja6ze0
  "2c93f98e02993a3a527685e7d84fef83ccf1d9100cc9d4ac43f82d833bc07a0ee370aadce8856a5f7424840183631b99a24caab7d0a50f7ca8e0a3c91f81b167",
  // tccqxf2t9kampkacx34u44032f83agua8hqyvtgn8kq
  "0cb0cc8f61268961ba7a2c702db66c9a8970fe5ce0b3d87a564895519df33c4611cb585bcd00ae47e410474987d4d8129de1305d48d5886be62b4ff50f284af3",
  // tccq9td7gtgjhu08ud9hs7uml0pj4lt36mdwyft72tl
  "16d7a9c195796975aa384a156a14150a9d3752d2a9cd290610d12a215d928f1c6ce16180aa209d0349f8eb6702cf5d061e8185ef6ea4728d86ee2b20a850640d",
  // tccq9wgeyu6znfhae09ldpld45ejjggtmdsuvqx5698
  "da4a1559b7ab680d1ae5bc322b0c1ce56bff4c0d811a3f03b24c8b41a71a692bc0943a2a2635835e9eac7a095ec65805190c0dfeaddaad20f01cbf0f290457d2",
  // tccqylhu0h3k3qqvtl5ptzr0x699pkp2repxy95n94r
  "ad36796cdf5d9dc9ddfa0baed6c427719f3cb9c86a1e14befe9ca4878e175d17fba867347b420780ebc65db9659122d22d290dff9d69e64cabe62cde482a28e5",
  // tccqxl28vw6282q9zxkuxs75hshett5ls05cy064xt2
  "ff3541f2714fc90c10712eb76f1ae06645570d18aae4ed8427b7d5eab1b1cddc1a6b1c4b3849818d860c79bb07a748268fe86baec88ac071d9dc592c21ba5abf",
  // tccqyyfspgkyq77cyxc6kk09azvvsg9hpyhrcv2j6as
  "579d2f2d337b0d9421db3e8dc8505c9de8408968036727eb29e873389a153aecb3d43f08b7e2131dc7ad1b929d74c3b2d78585e6f65ea286d8c7b8e2c1123b16"
  // tccq958tj6lzl6ymtfcdzrx2cth33jvtddqlypq54ed
];

export const validators: Signer[] = privateKeys.map(privateKey => {
  const publicKey = SDK.util.getPublicFromPrivate(privateKey);
  const accountId = SDK.util.getAccountIdFromPrivate(privateKey);
  const address = SDK.Core.classes.Address.fromPublic(
    publicKey,
    {
      networkId: "tc"
    }
  );
  return { privateKey, publicKey, accountId, address };
});
