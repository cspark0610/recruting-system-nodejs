import Position from "../db/schemas/Position.schema"

export const positionAggregates= {
	priority:(list:string)=>{
		return Position.aggregate([
			{$match:{
				isActive: (list === "active")
			}},{
        $addFields: {
            sortField: {
                $switch: {
                    branches: [
                        { case: { $eq: [ "$priority", "Low" ] }, then: 0 },
                        { case: { $eq: [ "$priority", "Normal" ] }, then: 1 },
                        { case: { $eq: [ "$priority", "High" ] }, then: 2 },
                        { case: { $eq: [ "$priority", "Urgent" ] }, then: 3 },
                    ],
                    default: -1
                }
            }
        }
    },
    {
        $sort: { sortField: -1 }
    }
		])
	}
}