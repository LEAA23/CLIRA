import type { StateCreator } from "zustand"
import type { CurrentGroup, Group, Groups, UserSearched, UserSearchForm } from "../types";
import { addMembertoGroup, createGroup, deleteGroup, getGroup, getGroups, removeMemberFromGroup, searchDeleteUser, searchUser, updateGroup } from "../api/groupsApi";

export type GroupsSliceType = {
    groups: Groups;
    group: CurrentGroup;
    userSearched: UserSearched;
    fetchGroups: () => Promise<void>;
    createGroup: (formData: FormData) => Promise<string>;
    fetchGroup: (id: number) => Promise<void>;
    updateGroup: ( { groupId, formData } : {groupId:number; formData: FormData}  ) => Promise<string>;
    deleteGroup: (id: number) => Promise<string>
    cleanGroup: () => void;
    cleanUserSearched: () => void;
    fetchUser: (email: string) => Promise<void>;
    addMembertoGroup: ( { groupId, user } : { groupId : Group["id"] ; user : UserSearched } ) => Promise<string>;
    fetchUserDelete: ({ groupId, email }: { groupId: number; email: string; }) => Promise<void>
    removeMemberFromGroup: ({ groupId, user }: { groupId: number; user: UserSearched; }) => Promise<string>;
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
    userSearched: {
        id: 0,
        name: "",
        lastName: "",
        email: ""
    },
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
    cleanUserSearched: () => {
        set(() => ({
            userSearched: {
                id: 0,
                name: "",
                lastName: "",
                email: ""
            }
        }))
    },

    fetchUser: async( email : UserSearchForm["email"] ) => {
        const userSearched = await searchUser( email );
        set(() => ({
            userSearched
        }));
    },
    addMembertoGroup: async( { groupId, user } : { groupId : Group["id"] ; user : UserSearched } ) => {
        const message = await addMembertoGroup( { groupId, email: user.email } );
        if( message === "El usuario fue agregado correctamente" ) {
            set((state) => ({
                group: {
                    ...state.group,
                    users: [...state.group.users, user]
                }
            }));

            get().cleanUserSearched();
        }
        return message;
    },
    fetchUserDelete: async( { groupId, email } : { groupId : Group["id"] ; email : UserSearched["email"] } ) => {
        const userSearched = await searchDeleteUser( { groupId, email} );
        set(() => ({
            userSearched
        }))
    },
    removeMemberFromGroup: async( { groupId, user } : { groupId: Group["id"] ; user: UserSearched } ) => {
        const message = await removeMemberFromGroup( { groupId, email: user.email } );
        if( message === `${user.name} fue eliminado del grupo correctamente` ) {
            set((state) => ({
                group: {
                    ...state.group,
                    users: state.group.users.filter( u => u.id !== user.id )
                }
            }))

            get().cleanUserSearched();
        }
        return message;
    }
})