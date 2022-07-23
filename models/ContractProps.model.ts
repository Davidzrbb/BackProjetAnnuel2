export interface ContractProps {
    id?: number,
    idParent: number,
    idBabysitter: number,
    validateAt: Date,
    numberOfHours: number,
    hourlyWage: number,
    qrCode?: number,
    numberOfSitting: number,
    numberOfHoursDone: number,
    startDate: Date,
    endDate: Date,
    step: number
}