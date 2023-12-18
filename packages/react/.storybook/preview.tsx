/** @type { import('@storybook/react').Preview } */
import React from "react";
import { TractorbeamProvider } from "../src/components/tractorbeam-provider";
import { Preview } from "@storybook/react";
import { TractorbeamAI } from "@tractorbeamai/backend";

const preview: Preview = {
    loaders: [
        async () => {
            const tb = new TractorbeamAI(
                "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnVjw/4khINFwzO4dI6M3XS+eXMHp1rmZlGQLfc/3zbDCMRgtqy5px0RD54Vyob7teBztzWrE+UKU3COJzWuXksN5AG9l+EABwFugfMKoHUCQcxNEh8jLK2u+TE9FItDRi0PTDx7kHqUYrkhTE4YmTZ3J1rhtsY8z5oE/VVvR6HcneEzgl5FgkD67FqprETtYmn9ylVjrpPafsCqe309siTk8MsfHgOSnpJcgG9VhmzWIP9+sXzAfdABYhFGYdl9rOw50FTJJZe4uFe+wnJgfVzPs9FHgxT9ERh2sfWTkB2SGzZ8OhxoSZUGGKxn6KmoL/0FHBN40Xy36jFlBoBvWVwIDAQAB",
                "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdWPD/iSEg0XDM7h0jozddL55cwenWuZmUZAt9z/fNsMIxGC2rLmnHREPnhXKhvu14HO3NasT5QpTcI4nNa5eSw3kAb2X4QAHAW6B8wqgdQJBzE0SHyMsra75MT0Ui0NGLQ9MPHuQepRiuSFMThiZNncnWuG2xjzPmgT9VW9Hodyd4TOCXkWCQPrsWqmsRO1iaf3KVWOuk9p+wKp7fT2yJOTwyx8eA5KeklyAb1WGbNYg/36xfMB90AFiEUZh2X2s7DnQVMkll7i4V77CcmB9XM+z0UeDFP0RGHax9ZOQHZIbNnw6HGhJlQYYrGfoqagv/QUcE3jRfLfqMWUGgG9ZXAgMBAAECggEAAvfaKN4ZFNRZRRxhdR3PemMl2cimcVQe3H4G3iJtzDXp5MSjYiCtESZmdjDhiMF1jTfjX9fLYVJZYYbTppgzRJzDCGoDVF1a9cTr09P//NvxqEy7W/AmWP+60Ptdm4/p3cvXBSGANyMb0JR/sLGmpIugnV9CfnlBXDdL1fFvTt3JbQQuUeMOf0v9Z7tKSPAPbjjZaC3GkMd+rFGJJJF89gTmNcCYc9bR1qmT2QX9lMufgsFHtODoyUkhAJbvyoreLQYB2C/xRb8qwEziTWKvN6w2tuBXxHpbLzq62QVhycsIt7H1NUn7zXQPoM4wjivZFP3hbO+gwIRYPGZRJ9AS1QKBgQDLekAPx6aPBNgHm31gmjKOD7x+PvrARKLeCD9ch3/SRcxR/WDIx36Sd74LCY5AsaWML59tPo7IC0ggzoKSDBuOfj16/qUCoZYwChFwLvo7IM3AMM6kgXk0eGma6r0Ls68auajtQmeckhZiy/WfOaEYiSlajaKmoZO1Co9GbTtMlQKBgQDF9mx7nzwPrIBEbrvt8fnRMMDYchnRtrXQw9GxkNgQQlO1Qi13fvWSFw27/GtJhR/HkpnQT3lL0Y/touK4wWYB03+5X3CSFFUg12eWx4kJSQECKyQUGFrPaLclsvUfcYGpxdjWbeZEYcc1Xl/cLtugj8ovUcC4ZvfuZ7W2DjBwOwKBgA6mw9wfBShBMgkCMjn1gHRoP6tbf5S+nHeeYmmYPCT476hrtT9f1gZX5vBGhN61q/T3LOSh34gZ/9yU4iQACS/ueSDVGy6gUf8timnoiA4f45DWMtr3k7GqhfgotOoVyyMCgV5sLKfCgSgmBY6siKQKpFan4jFbaxZbJ0vr65wtAoGBAI0GGowKiL/ltE6L0CcXLU8/+vF2fzwte+JnzVdAhxs2FOnYZgltkUVsVOVpUYjDZDtJDXgfVZqUhILWecsCQ0fjwmZtPgVipK5LpUj9hnrt3eEMmJwUKYT95RLfJM4sjyFBh1JiYhquyToUrBdv7he4t2D0TWVQPSlCCmnSO+GHAoGAJaMALyNO1OjoUbbr75z4HeBMPMLo2PGEMbhMJIGBK0ml059sZfG8r7F2nZxX8L1L18IzIV+GNw7ImrIXIwehGBp9JjYluZpsH9Kw3nl4PHwzazxwVGx1B5XEAZhMQJZ07JfwV4ycqch2fJYYHkBQs6RtZCrCczKMzG3uMFGXeOE=",
            );

            const token = await tb.createToken({
                identity: "wbfletch@gmail.com",
                projectId: 1,
            });

            return { token };
        },
    ],
    decorators: [
        (Story, { loaded: { token } }) => (
            <TractorbeamProvider token={token} apiURL="http://127.0.0.1:8787">
                <Story />
            </TractorbeamProvider>
        ),
    ],
};

export default preview;
