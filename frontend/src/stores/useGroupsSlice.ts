import type { StateCreator } from "zustand"
import type { Groups } from "../types";
import { getGroups } from "../api/groupsApi";


export type GroupsSliceType = {
    groups: Groups;
    fetchGroups: () => Promise<void>;
}

export const createGroupsSlice : StateCreator<GroupsSliceType> = ( set ) => ({
    groups: [],
    fetchGroups: async () => {
        const groups = await getGroups();
        set(() => ({
            groups
        }));
    }
})