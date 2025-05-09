import Image from "next/image";

import {ContactForm} from '@modules/contact/front/components';
import { Button } from "@/components/backoffice/ui/button";

export default function Home() {
  return (
   <div>
     <Button>Hello World</Button>
     <ContactForm app={"abcdef"}/>
   </div>
  );
}
