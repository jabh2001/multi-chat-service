import './textButton.css'

interface TextButtonProps {
  text: string,
  isActive:string
}

export const TextButton: React.FC<TextButtonProps> = ({ text, isActive}) => {
  return (
    <div className='contenedorPrincipal'>
      <div className={`textButton ${isActive === 'true' ? 'isActive' : ''}`} >
        <button >{text}</button>
        <div className='mesagesNumber'>
          4
        </div>
      </div>
      <div className='barra'>

      </div>
    </div>

  );
};