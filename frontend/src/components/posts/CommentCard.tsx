import type { Comment } from "../../types";
import ProfileTagName from "./ProfileTagName";

type CommentaCardProps = {
  id: number,
  content: string,
  post_id: number,
  user: Comment["user"],
  createdAt: string,
  updatedAt: string
}

const CommentaCard = ( { id, content, post_id, user, createdAt, updatedAt } : CommentaCardProps ) => {
  return (
    <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-amber-400">
      <div className="ml-5">
        <ProfileTagName
          name={ user.name }
          lastName={ user.lastName }
        />
      </div>
      <div className="mt-3 ml-8">
        <p className="text-sm font-medium text-gray-400">
          <span className="font-semibold">fecha de publicaci&oacute;n: </span>{createdAt}
        </p>
        <p>
          { content }
        </p>
      </div>
    </div>
  )
}

export default CommentaCard