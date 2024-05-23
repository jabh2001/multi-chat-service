interface AvatarProps {
    svgData: string; // Assuming the SVG data is passed as a string
  }
  
  const Avatar: React.FC<AvatarProps> = ({ svgData }) => {
    return (
      <div className="avatar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" dangerouslySetInnerHTML={{ __html: svgData }} />
      </div>
    );
  }
  
export default Avatar