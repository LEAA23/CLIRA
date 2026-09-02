import type { StateCreator } from "zustand"
import type { Group } from "../types";
import { createPost } from "../api/groupsApi";

export type PostsSliceType = {
    createPost: ({ groupId, formData }: { groupId: number; formData: FormData; }) => Promise<string>;
}

export const createPostsSlice : StateCreator<PostsSliceType> = ( set ) =>({

    createPost: async( { groupId, formData } : { groupId: Group["id"] ; formData : FormData } ) => {
        const message = await createPost( { groupId, formData } );
        return message;
    }

});