import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from '../models/TestStationDAO';

export const putTestStation = async (testStation: any) => {
  const testStationDAO = new TestStationDAO();
  const service = new TestStationService(testStationDAO);
  return await service.putTestStation(testStation);
};
