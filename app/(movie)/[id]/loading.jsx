import css from "../../../styles/loading.module.css"

export default function Loading() {
    return(
        <img className={css.img} src="/img/loading.gif" alt="로딩중" />
    )
}