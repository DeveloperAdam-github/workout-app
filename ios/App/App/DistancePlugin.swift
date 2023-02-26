import Foundation
import Capacitor
import HealthKit

var healthStore: HKHealthStore = HKHealthStore();
@objc(DistancePlugin)
public class DistancePlugin: CAPPlugin {
    @objc func authorize(_ call: CAPPluginCall) {
        if HKHealthStore.isHealthDataAvailable() {
            let allTypes = Set([HKObjectType.quantityType(forIdentifier: .stepCount)!,
                                        HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
                                        HKObjectType.workoutType()])
            healthStore.requestAuthorization(toShare: allTypes, read: allTypes) { (success, error) in
                if !success {
                    call.reject("Could not get permission")
                    return
                }
                call.resolve();
            }
        } else {
            call.reject("Health data not available")
        }
    }
    @objc func getDistance(_ call: CAPPluginCall){
        guard let start = call.options["startDate"] as? String else {
            call.reject("Must provide start date")
            return
        }
        let dateFormatter = DateFormatter();
        dateFormatter.dateFormat = "yyyy/MM/dd";
        let now = Date()
        let startDate = dateFormatter.date(from: start);
        let distanceQuantityType = HKQuantityType.quantityType(forIdentifier: .distanceWalkingRunning)!
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: now, options: HKQueryOptions.strictStartDate)
        let query = HKStatisticsQuery(quantityType: distanceQuantityType, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, _ in
            guard let result = result, let sum = result.sumQuantity() else {
                call.reject("Could not query data");
                return
            }
            let totalDistance = sum.doubleValue(for: HKUnit.meter())
            call.resolve([
                "totalDistance": totalDistance
            ])
        }
        healthStore.execute(query)
    }
    
    @objc func getWorkouts(_ call: CAPPluginCall){
        let workoutSortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)
        let calendar = Calendar.current
        let endDate = Date()
        let startDate = calendar.date(byAdding: .day, value: -7, to: endDate)!
        let workoutPredicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])

        let workoutQuery = HKSampleQuery(sampleType: HKSampleType.workoutType(), predicate: workoutPredicate, limit: HKObjectQueryNoLimit, sortDescriptors: [workoutSortDescriptor]) { (query, samples, error) in
            if let samples = samples as? [HKWorkout], error == nil {
                       var workoutData: [[String: Any]] = []
                       for workout in samples {
                           let energyBurnedSample = workout.totalEnergyBurned
                           let calories = energyBurnedSample?.doubleValue(for: .kilocalorie())
                           let workoutID = workout.uuid.uuidString
                           
                           var workoutTypeString = ""
                           
                           switch workout.workoutActivityType.rawValue {
                               case 13:
                                   workoutTypeString = "Outdoor Cycle"
                               case 50:
                                   workoutTypeString = "Traditional Strength Training"
                               case 37:
                                   workoutTypeString = "Outdoor Run"
                               default:
                                   workoutTypeString = "Other"
                           }
                           
                           let workoutDict: [String: Any] = ["startDate": workout.startDate, "duration": workout.duration, "calories": calories!, "workoutType": workoutTypeString, "id": workoutID]
                           workoutData.append(workoutDict)
                       }
                       call.resolve([
                           "workouts": workoutData
                       ])
            } else {
                // error handling
            }
        }

        healthStore.execute(workoutQuery)

    }
    
    @objc func getLast3Workouts(_ call: CAPPluginCall){
            let workoutSortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)
            let calendar = Calendar.current
            let endDate = Date()
            let startDate = calendar.date(byAdding: .day, value: -7, to: endDate)!
            let workoutPredicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: [])

            let workoutQuery = HKSampleQuery(sampleType: HKSampleType.workoutType(), predicate: workoutPredicate, limit: 3, sortDescriptors: [workoutSortDescriptor]) { (query, samples, error) in
                if let samples = samples as? [HKWorkout], error == nil {
                           var workoutData: [[String: Any]] = []
                           for i in 0..<min(3, samples.count) {
                               let workout = samples[i]
                               let energyBurnedSample = workout.totalEnergyBurned
                               let calories = energyBurnedSample?.doubleValue(for: .kilocalorie())
                               let workoutID = workout.uuid.uuidString
                               
                               var workoutTypeString = ""
                               
                               switch workout.workoutActivityType.rawValue {
                                   case 13:
                                       workoutTypeString = "Outdoor Cycle"
                                   case 50:
                                       workoutTypeString = "Traditional Strength Training"
                                   case 37:
                                       workoutTypeString = "Outdoor Run"
                                   default:
                                       workoutTypeString = "Other"
                               }
                               
                               let workoutDict: [String: Any] = ["startDate": workout.startDate, "duration": workout.duration, "calories": calories!, "workoutType": workoutTypeString, "id": workoutID]
                               workoutData.append(workoutDict)
                           }
                           call.resolve([
                               "workouts": workoutData
                           ])
                } else {
                    // error handling
                }
            }

            healthStore.execute(workoutQuery)

        }
    
    @objc func getTodaySteps(_ call: CAPPluginCall) {
        let now = Date()
        let startOfToday = Calendar.current.startOfDay(for: now)
        let endOfToday = Calendar.current.date(byAdding: .day, value: 1, to: startOfToday)!
        let stepsQuantityType = HKQuantityType.quantityType(forIdentifier: .stepCount)!
        let predicate = HKQuery.predicateForSamples(withStart: startOfToday, end: endOfToday, options: HKQueryOptions.strictStartDate)
        let query = HKStatisticsQuery(quantityType: stepsQuantityType, quantitySamplePredicate: predicate, options: .cumulativeSum) { (_, result, _) in
            guard let result = result, let sum = result.sumQuantity() else {
                call.reject("Could not query data")
                return
            }
            let totalSteps = sum.doubleValue(for: HKUnit.count())
            call.resolve([
                "totalSteps": totalSteps
            ])
        }
        healthStore.execute(query)
    }
    
}
