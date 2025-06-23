import {ReactNode} from 'react';
 
// These tags are available
type Tag = 'p' | 'b' | 'i' | 'a' | 'ol' | 'ul' | 'li' | 'list1' | 'list2' | 'list3' | 'list4' | 'list5' | 'list6' | 'list7' | 'list8' | 'list9' | 'list10' | 'list11' | 'list12' | 'liststr1' | 'liststr2' | 'liststr3' | 'thead' | 'tbody' | 'tfoot' | 'tr' | 'th' | 'td' | 'tableres';
 
type Props = {
  children(tags: Record<Tag, (chunks: ReactNode) => ReactNode>): ReactNode
};
 
export default function RichText({children}: Props) {
  return (
    <div className="prose">
      {children({
        p: (chunks: ReactNode) => <p>{chunks}</p>,
        b: (chunks: ReactNode) => <b className="font-semibold">{chunks}</b>,
        i: (chunks: ReactNode) => <i className="italic">{chunks}</i>,
        a: (chunks: ReactNode) => <a href='#'>{chunks}</a>,
        ol: (chunks: ReactNode) => <ol type='1' start={1} className='mt-3'>{chunks}</ol>,
        ul: (chunks: ReactNode) => <ul>{chunks}</ul>,
        li: (chunks: ReactNode) => <li>{chunks}</li>,
        list1: (chunks: ReactNode) => <ol type='1' start={1} className='mt-3'>{chunks}</ol>,
        list2: (chunks: ReactNode) => <ol type='1' start={2} className='mt-3'>{chunks}</ol>,
        list3: (chunks: ReactNode) => <ol type='1' start={3} className='mt-3'>{chunks}</ol>,
        list4: (chunks: ReactNode) => <ol type='1' start={4} className='mt-3'>{chunks}</ol>,
        list5: (chunks: ReactNode) => <ol type='1' start={5} className='mt-3'>{chunks}</ol>,
        list6: (chunks: ReactNode) => <ol type='1' start={6} className='mt-3'>{chunks}</ol>,
        list7: (chunks: ReactNode) => <ol type='1' start={7} className='mt-3'>{chunks}</ol>,
        list8: (chunks: ReactNode) => <ol type='1' start={8} className='mt-3'>{chunks}</ol>,
        list9: (chunks: ReactNode) => <ol type='1' start={9} className='mt-3'>{chunks}</ol>,
        list10: (chunks: ReactNode) => <ol type='1' start={10} className='mt-3'>{chunks}</ol>,
        list11: (chunks: ReactNode) => <ol type='1' start={11} className='mt-3'>{chunks}</ol>,
        list12: (chunks: ReactNode) => <ol type='1' start={12} className='mt-3'>{chunks}</ol>,
        liststr1: (chunks: ReactNode) => <ol type="a" start={1} className='mt-3'>{chunks}</ol>,
        liststr2: (chunks: ReactNode) => <ol type="a" start={2} className='mt-3'>{chunks}</ol>,
        liststr3: (chunks: ReactNode) => <ol type="a" start={3} className='mt-3'>{chunks}</ol>,
        thead: (chunks: ReactNode) => <thead>{chunks}</thead>,
        tbody: (chunks: ReactNode) => <tbody>{chunks}</tbody>,
        tfoot: (chunks: ReactNode) => <tfoot>{chunks}</tfoot>,
        tr: (chunks: ReactNode) => <tr>{chunks}</tr>,
        th: (chunks: ReactNode) => <th>{chunks}</th>,
        td: (chunks: ReactNode) => <td>{chunks}</td>,
        tableres: (chunks: ReactNode) => <div className='table-responsive mt-3 mb-3'><table className='table'>{chunks}</table></div>
      })}
    </div>
  );
}