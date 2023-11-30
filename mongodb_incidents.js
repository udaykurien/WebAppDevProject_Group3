db.createCollection(
    "incidents", {
        validator: {
            $jsonSchema: {
                bsonType:"object",
                required: ["reporter", "createdAt", "severityLevel", "incidentType"],
                properties: {
                    reporter: {
                        bsonType: "string"
                    },
                    assignedTo : {
                        bsonType: "string"
                    },
                    incidentType : {
                        bsonType : "string"
                    },
                    description : {
                        bsonType : "string"
                    },
                    severityLevel : {
                        bsonType : "number"
                    },
                    actionsTaken : {
                        bsonType: "string"
                    },
                    status : {
                        bsonType: "string"
                    },
                    createdAt : {
                        bsonType:"date"
                    },
                    closedAt : {
                        bsonType: "date"
                    },
                }
            }
        }
    }
);
