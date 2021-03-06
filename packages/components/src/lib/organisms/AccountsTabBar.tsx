import { AccountID } from '@walletts/core';
import * as CS from 'csstips';
import * as React from 'react';
import { style } from 'typestyle';
import { AccountUIData } from '../common/account';
import { AccountItem } from '../molecules/AccountItem';

export interface ValueProps {
  readonly accountsInfo: Record<AccountID, AccountUIData>;
}

export interface HandlerProps {
  readonly onclick: (id: string) => any;
}

export type Props = ValueProps & HandlerProps;

const AccountsTabBarStyle = style(
  CS.flex,
  CS.vertical,
  CS.verticallySpaced(10),
  {
    $nest: { '&:hover': { opacity: 0.98 } },
    listStyleType: 'none'
  }
);

export class AccountsTabBar extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { accountsInfo, onclick } = this.props;

    const aList = accountsInfo ? (
      Object.entries(accountsInfo).map(([id, a]) => (
        <AccountItem key={id} info={a} onclick={onclick} />
      ))
    ) : (
      <li key={'default'}> default Accounts Info</li>
    );
    return (
      <ul
        className={`${AccountsTabBarStyle} fa-ul`}
        style={{ listStyleType: 'none' }}
      >
        {aList}
      </ul>
    );
  }
}
