import type { StateCreator } from "zustand"
import type { CurrentGroup, Group, Groups } from "../types";
import { createGroup, getGroup, getGroups, updateGroup } from "../api/groupsApi";


export type GroupsSliceType = {
    groups: Groups;
    group: CurrentGroup;
    fetchGroups: () => Promise<void>;
    createGroup: (formData: FormData) => Promise<string>;
    fetchGroup: (id: number) => Promise<void>;
    updateGroup: ( { groupId, formData } : {groupId:number; formData: FormData}  ) => Promise<string>;
    clearGroup: () => void;
}

export const createGroupsSlice : StateCreator<GroupsSliceType> = ( set ) => ({
    group: {
        id: 0,
        name: "",
        bgImage: "",
        teacher: 0,
        teacherUser: {
            name: ""
        }
    },
    groups: [],
    fetchGroups: async () => {
        const groups = await getGroups();
        set(() => ({
            groups
        }));
    },
    createGroup: async(formData: FormData) => {
        const message = await createGroup(formData);
        return message;
    },
    fetchGroup: async( id : Group["id"] ) => {
        const group = await getGroup( id );
        set(() => ({
            group
        }))
    },
    updateGroup: async( { groupId, formData } : { groupId:Group["id"]; formData: FormData } ) => {
        const message = await updateGroup( {groupId, formData} );
        return message;
    },
    clearGroup: () => {
        set(() => ({
            group: {
                id: 0,
                name: "",
                bgImage: "",
                teacher: 0,
                teacherUser: {
                    name: ""
                }
            }
        }));
    }
})