import ProfileTagName from "./ProfileTagName"

const CommentaCard = () => {
  return (
    <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-amber-400">
      <div className="ml-5">
        <ProfileTagName/>
      </div>
      <div className="mt-3 ml-8">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus vitae numquam ipsum soluta! Distinctio saepe 
          libe
        </p>
      </div>
    </div>
  )
}

export default CommentaCard