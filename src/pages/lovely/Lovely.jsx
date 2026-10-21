import DocWrapper from '../../components/DocWrapper'
import LovelyList from './LovelyList'

export default function Lovely({ className }) {
    return (
        <DocWrapper className={className} background="#f1e6fb">
            <LovelyList />
        </DocWrapper>
    )
}
