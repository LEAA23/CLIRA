import ProfileTagName from "./ProfileTagName";

type CommentaCardProps = {
  id: number,
  content: string,
  post_id: number,
  user_id: number,
}

const CommentaCard = ( { id, content, post_id, user_id } : CommentaCardProps ) => {
  return (
    <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-amber-400">
      <div className="ml-5">
        <ProfileTagName/>
      </div>
      <div className="mt-3 ml-8">
        <p>
          { content }
        </p>
      </div>
    </div>
  )
}

export default CommentaCard