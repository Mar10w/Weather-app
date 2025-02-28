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
  if (!weatherData) {
    throw new Error('No weather data found');
  }
  // TODO: save city to search history
  await historyService.addCity(cityName);
  res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
}
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const searchHistory = await historyService.getSearchHistory();
    res.json(searchHistory);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await historyService.removeCity(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting city from history:', error);
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;
