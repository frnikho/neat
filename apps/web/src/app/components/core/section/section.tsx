import {SectionLoader} from "@app/components/core/section/section.loader";

export type SectionProps = {
    lkey: string;
}

export default function Section({lkey} : SectionProps) {
    return (
        <SectionLoader lkey={lkey} children={() => (
            <div>
                hello world
            </div>
        )}/>
    )
}

/// une section peux contenir plusieurs widgets, chaque widget peut être édité individuellement
/// une section peut être réorganisée, les widgets peuvent être déplacés entre les sections
/// une section peut être supprimée, tous les widgets qu'elle contient seront également supprimés
