import { useAppStore } from "../../stores/useAppStore";

const getSources = () => {
    const simulationCase = useAppStore.getState().case;

    const resources = [
        {
            name: "hospitalRoomModel",
            type: "gltfModel",
            path: "/defaultModels/charite_university_hospital_-_operating_room/scene.gltf"
        },
        {
            name: "patientModel",
            type: "gltfModel",
            path: "/defaultModels/patientModels/malePatient.glb"
        }
    ];

    if (
        typeof simulationCase.simulationModel === "string" &&
        simulationCase.simulationModel.trim() !== ""
    ) {
        resources[1].path = simulationCase.simulationModel;
    }

    return resources;
};

export default getSources;