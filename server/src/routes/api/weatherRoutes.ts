import { Router, type Request, type Response } from 'express';
import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';


const router = Router();

// TODO: POST Request with city name to retrieve weather data

router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { cityName } = req.body;
  try {
  const weatherData = await weatherService.getWeatherForCity(cityName);
  // TODO: save city to search history
  await historyService.addCity(cityName);
  res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
}
});

// TODO: GET search history
router.get('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
  await historyService.removeCity(id);
  res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch search history' });
}
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await historyService.removeCity(id);
  res.sendStatus(204);
});

export default router;
