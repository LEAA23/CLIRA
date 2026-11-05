import {
    ChatBubbleOvalLeftEllipsisIcon,
    HeartIcon
} from "@heroicons/react/16/solid";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import ProfileTagName from "./ProfileTagName";
import { useAppStore } from "../../stores/useAppStore";
import PostCardOptions from "./PostCardOptions";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

type PostCardProps = {
    id: number;
    title: string;
    content: string;
    firstImage?: string;
    userName: string;
    userLastName: string;
    profileImage: string | null;
};

const PostCard = ({
    id,
    title,
    content,
    firstImage,
    userName,
    userLastName,
    profileImage
}: PostCardProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const groupId = Number(params.id);

    const user = useAppStore(state => state.user);
    const posts = useAppStore(state => state.posts);
    const post = posts.find(item => item.id === id);
    const likePost = useAppStore(state => state.likePost);

    // Detectar si la publicación anuncia un caso clínico.
    const caseMatch = content.match(/\[\[CLIRA_CASE:(\d+)\]\]/);

    const clinicalCaseId = caseMatch
        ? Number(caseMatch[1])
        : null;

    // Ocultar el marcador interno del contenido.
    const visibleContent = content
        .replace(/\[\[CLIRA_CASE:\d+\]\]/g, "")
        .trim();

    const openPost = () => {
        navigate(
            location.pathname + `?viewPost=true&post=${id}`
        );
    };

    const handleLike = async (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();

        try {
            await likePost({
                groupId,
                postId: id
            });
        } catch (error) {
            console.error(error);
        }
    };

    const openClinicalCase = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.stopPropagation();

        if (clinicalCaseId) {
            navigate(`/simulation/${clinicalCaseId}`);
        }
    };

    return (
        <article
            onClick={openPost}
            className="group flex flex-col bg-white dark:bg-gray-800
            border border-gray-100 dark:border-gray-700 rounded-2xl
            shadow-sm overflow-hidden cursor-pointer
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex justify-between items-start gap-3 p-5">

                <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider
                    font-semibold text-blue-500 mb-2">
                        {clinicalCaseId
                            ? "Caso clínico asignado"
                            : "Publicación del grupo"}
                    </p>

                    <h3 className="text-xl font-bold text-gray-800
                    dark:text-white line-clamp-2 break-words">
                        {title}
                    </h3>
                </div>

                {user.id === post?.user_id && (
                    <div onClick={event => event.stopPropagation()}>
                        <PostCardOptions post_id={id} />
                    </div>
                )}
            </div>

            {firstImage ? (
                <div className="h-52 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                        src={firstImage}
                        alt={`Imagen de la publicación ${title}`}
                        className="w-full h-full object-cover
                        group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            ) : (
                <div className="h-2 bg-gradient-to-r
                from-blue-500 via-indigo-500 to-purple-500" />
            )}

            <div className="p-5 flex-1 flex flex-col">

                <div className="mb-4">
                    <ProfileTagName
                        id={post?.user_id ?? 0}
                        name={userName}
                        lastName={userLastName}
                        profileImage={profileImage}
                    />
                </div>

                <p className="text-gray-600 dark:text-gray-300
                leading-relaxed line-clamp-3 flex-1 whitespace-pre-line">
                    {visibleContent}
                </p>

                {clinicalCaseId && (
                    <button
                        type="button"
                        onClick={openClinicalCase}
                        className="mt-5 flex w-full items-center justify-center
                        gap-2 rounded-xl bg-purple-600 px-4 py-3
                        font-bold text-white transition
                        hover:bg-purple-700 active:scale-[0.98]"
                    >
                        <AcademicCapIcon className="h-5 w-5" />
                        Abrir simulación clínica
                    </button>
                )}

                <div className="flex items-center justify-between gap-3
                mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">

                    <button
                        type="button"
                        onClick={handleLike}
                        className={`flex items-center gap-2 font-semibold
                        transition-colors ${
                            post?.likedByMe
                                ? "text-red-500"
                                : "text-gray-400 hover:text-red-500"
                        }`}
                    >
                        <HeartIcon className="h-6 w-6" />

                        <span className="text-sm">
                            {post?.likesCount
                                ? `${post.likesCount} Me gusta`
                                : "Me gusta"}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={event => {
                            event.stopPropagation();
                            openPost();
                        }}
                        className="flex items-center gap-2
                        text-gray-400 hover:text-blue-500
                        font-semibold transition-colors"
                    >
                        <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
                        <span className="text-sm">Ver comentarios</span>
                    </button>

                </div>
            </div>
        </article>
    );
};

export default PostCard;
