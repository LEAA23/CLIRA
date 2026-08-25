import type { StateCreator } from "zustand"
import type { AddMemberForm, CurrentGroup, Group, Groups } from "../types";
import { addMembertoGroup, createGroup, deleteGroup, getGroup, getGroups, updateGroup } from "../api/groupsApi";


export type GroupsSliceType = {
    groups: Groups;
    group: CurrentGroup;
    fetchGroups: () => Promise<void>;
    createGroup: (formData: FormData) => Promise<string>;
    fetchGroup: (id: number) => Promise<void>;
    updateGroup: ( { groupId, formData } : {groupId:number; formData: FormData}  ) => Promise<string>;
    deleteGroup: (id: number) => Promise<string>
    cleanGroup: () => void;
    addMembertoGroup: ( { groupId, email } : { groupId : Group["id"] ; email : AddMemberForm["email"] } ) => Promise<string>;
}

export const createGroupsSlice : StateCreator<GroupsSliceType> = ( set, get ) => ({
    group: {
        id: 0,
        name: "",
        bgImage: "",
        teacher: 0,
        teacherUser: {
            name: ""
        },
        users: []
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
        set(() => ({
            groups : get().groups.map( group => {
                if(group.id === groupId) {
                    return {
                        ...group,
                        name: formData.get("name") as string
                    }
                }
                return group;
            } )
        }))
        return message;
    },
    deleteGroup: async( id : Group["id"] ) => {
        const message = await deleteGroup( id );
        set(() => ({
            groups: get().groups.filter( group => group.id !== id )
        }));
        return message;
    },
    cleanGroup: () => {
        set(() => ({
            group: {
                id: 0,
                name: "",
                bgImage: "",
                teacher: 0,
                teacherUser: {
                    name: ""
                },
                users: []
            }
        }));
    },
    addMembertoGroup: async( { groupId, email } : { groupId : Group["id"] ; email : AddMemberForm["email"] } ) => {
        const message = await addMembertoGroup( { groupId, email } );
        return message;
    }
})