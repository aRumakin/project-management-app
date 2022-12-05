import classNames from 'classnames';

import type {
  FC,
  DetailedHTMLProps,
  HTMLAttributes,
  HTMLAttributeAnchorTarget,
  ReactNode,
} from 'react';

import './Link.pcss';

interface LinkProps extends DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  href: string;
  target?: HTMLAttributeAnchorTarget;
  text?: string;
  children?: ReactNode;
}

export const Link: FC<LinkProps> = ({
  href,
  target,
  text,
  className,
  children,
  ...restProps
}): JSX.Element => (
  <a
    className={
      classNames(
        'link',
        className,
      )
    }
    href={href}
    rel='noreferrer noopener'
    target={target || '_self'}
    {...restProps}
  >
    {text}
    {children}
  </a>
);
