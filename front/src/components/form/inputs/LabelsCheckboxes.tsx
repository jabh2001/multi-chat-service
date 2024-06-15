import { useLabel } from "../../../hooks/useLabelStore"

type Props = {
    selectedIds : number[]
    setSelectedIds : React.Dispatch<React.SetStateAction<number[]>>
}
export default function LabelsCheckboxes({ selectedIds, setSelectedIds }:Props){
    const { labels } = useLabel()

    return (
        <>
            {
                labels.map((label) => {
                    const checked = selectedIds.includes(label.id)
                    return (
                        <label 
                            key={`label_${label.id}_${label.name}`}
                            className={`
                                flex gap-2 items-center justify-center transition
                                border-primary border-2 rounded-md p-2 text-primary
                                ${ checked  ? 'border-4' : '' }

                            `}>
                            <input
                                className={"w-4 h-4 accent-blue-500 rounded "}
                                type="checkbox"
                                checked={checked}
                                onChange={() => setSelectedIds(
                                    checked ? selectedIds.filter(id => id !== label.id) : [...selectedIds, label.id]
                                )}
                            />
                            <span>{label.name}</span>
                        </label>
                )})
            }
        </>
    )
}