import styles from "./index.module.css"
type Props = {
    src:string
    alt:string
    size?: "sm" | "md" | "lg" | "xl" | "full"
}
export default function CircleAvatar({ src, alt, size="md" }:Props){
    const sizes = { sm:styles.sm, md:styles.md, lg:styles.lg, xl:styles.xl, full:styles.full };

    return <img className={`${styles.avatar} ${sizes[size]}`} src={src}  alt={alt}/>
}