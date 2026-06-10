import test from 'node:test';
import assert from 'node:assert';
import { 
  ClusteringService, 
  RouteOptimizer, 
  Scheduler, 
  MealInserter,
  PlaceFilter
} from '../services/index.js';
import type { SchedulablePlace, Preferences } from '@travelbuddy/shared';

test('Full Algorithm Pipeline', async (t) => {
  // Mock Data
  const stayLocation = { latitude: 15.5500, longitude: 73.7500, name: 'Baga Hotel' };
  const preferences: Preferences = {
    numDays: 2,
    budget: 'MEDIUM',
    stayLocation,
    interests: ['beach', 'fort'],
    includeBreakfast: true
  };

  const mockPlaces: SchedulablePlace[] = [
    { id: '1', name: 'Baga Beach', latitude: 15.5553, longitude: 73.7514, type: 'ATTRACTION', estimatedDurationMinutes: 120, tags: ['beach'] },
    { id: '2', name: 'Calangute Beach', latitude: 15.5438, longitude: 73.7553, type: 'ATTRACTION', estimatedDurationMinutes: 120, tags: ['beach'] },
    { id: '3', name: 'Fort Aguada', latitude: 15.4933, longitude: 73.7736, type: 'ATTRACTION', estimatedDurationMinutes: 90, tags: ['fort'] },
    { id: '4', name: 'Chapora Fort', latitude: 15.6044, longitude: 73.7330, type: 'ATTRACTION', estimatedDurationMinutes: 60, tags: ['fort'] },
    { id: '5', name: 'Anjuna Beach', latitude: 15.5725, longitude: 73.7404, type: 'ATTRACTION', estimatedDurationMinutes: 120, tags: ['beach'] },
  ];

  const mockRestaurants: SchedulablePlace[] = [
    { id: 'r1', name: 'Britto\'s', latitude: 15.5519, longitude: 73.7545, type: 'RESTAURANT', estimatedDurationMinutes: 60, mealType: 'LUNCH' },
    { id: 'r2', name: 'Thalassa', latitude: 15.5925, longitude: 73.7350, type: 'RESTAURANT', estimatedDurationMinutes: 90, mealType: 'DINNER' },
    { id: 'r3', name: 'Infantaria', latitude: 15.5375, longitude: 73.7600, type: 'RESTAURANT', estimatedDurationMinutes: 45, mealType: 'BREAKFAST' },
  ];

  await t.test('1. Place Filter', () => {
    const filtered = PlaceFilter.filter(mockPlaces, preferences);
    assert.ok(filtered.length > 0, 'Should return some places');
  });

  await t.test('2. Clustering', () => {
    const clusters = ClusteringService.clusterIntoDays(mockPlaces, preferences.numDays);
    assert.strictEqual(clusters.size, 2, 'Should create 2 clusters for 2 days');
    
    // Check that all places are assigned
    const totalAssigned = Array.from(clusters.values()).reduce((sum, arr) => sum + arr.length, 0);
    assert.strictEqual(totalAssigned, 5, 'All places should be assigned to a cluster');
  });

  await t.test('3. Route Optimization & 4. Scheduling & 5. Meal Insertion', () => {
    const clusters = ClusteringService.clusterIntoDays(mockPlaces, preferences.numDays);
    const day1Places = clusters.get(1) || [];

    // Optimize
    const optimizedRoute = RouteOptimizer.optimize(day1Places, stayLocation);
    assert.strictEqual(optimizedRoute.length, day1Places.length, 'Route should contain all places');

    // Schedule
    const schedule = Scheduler.assignTimeSlots(optimizedRoute, stayLocation, 9);
    assert.strictEqual(schedule.length, optimizedRoute.length, 'Schedule should have same number of slots');

    // Meal Insertion
    const finalSchedule = MealInserter.insertMeals(schedule, mockRestaurants, undefined, true);
    assert.ok(finalSchedule.length > schedule.length, 'Meals should be inserted');
    
    const hasBreakfast = finalSchedule.some(s => s.mealType === 'BREAKFAST');
    const hasLunch = finalSchedule.some(s => s.mealType === 'LUNCH');
    const hasDinner = finalSchedule.some(s => s.mealType === 'DINNER');
    
    assert.ok(hasBreakfast, 'Should insert breakfast');
    assert.ok(hasLunch, 'Should insert lunch');
    assert.ok(hasDinner, 'Should insert dinner');
  });
});
