import { useAppStore } from "../../stores/useAppStore";
import type { Comment } from "../../types";
import CommentCardOptions from "./CommentCardOptions";
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

  const userAuth = useAppStore( state => state.user );
  return (
    <div className="bg-white shadow rounded-lg p-5 border-l-4 border-l-amber-400">
      <div className="ml-5 flex justify-between items-center">
        <ProfileTagName
          name={ user.name }
          lastName={ user.lastName }
        />
        {userAuth.id === user.id && (
            <CommentCardOptions
              id={id}
              post_id={post_id}
            />
        )}
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