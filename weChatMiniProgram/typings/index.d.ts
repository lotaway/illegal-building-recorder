/// <reference path="./types/index.d.ts" />

interface IAppOption {
    globalData: {
        isSignIn: boolean
        user: {
            id: number
            name: string
            currentUnit: string
            rank: number
            region: {
                belongArea: {
                    name: string
                    id: number
                },
                city: {
                    name: string
                    id: number
                }
            }
            statistics: {
                areaSize: number
                missionRecord: number
                investigateMissionRecord: number
                investigateArea: number
                dealMissionRecord: number
                dealArea: number
            }
        }
    }
    readUserStatusAndDataFormCache: Function
}