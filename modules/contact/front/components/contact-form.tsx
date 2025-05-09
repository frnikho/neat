import React from "react";

export type Props = {
  app: string;
}

export function ContactForm(props: Props) {
  return (
    <div>
      <p>Hello World {props.app}</p>
    </div>
  )
}