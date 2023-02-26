import Foundation
import Capacitor
import Contacts

@objc(ProfilePicture)
public class ProfilePicture: CAPPlugin {
    @objc func authorizeContacts(_ call: CAPPluginCall) {
        let authorizationStatus = CNContactStore.authorizationStatus(for: .contacts)
        
        switch authorizationStatus {
        case .authorized:
            call.resolve(["authorized": true])
        case .denied, .restricted:
            call.resolve(["authorized": false])
        case .notDetermined:
            let contactStore = CNContactStore()
            contactStore.requestAccess(for: .contacts) { (granted, error) in
                if granted {
                    call.resolve(["authorized": true])
                } else {
                    call.reject("Contacts authorization denied.")
                }
            }
        }
    }

    @objc func getProfilePicture(_ call: CAPPluginCall) {
        let store = CNContactStore()
        let keysToFetch = [CNContactGivenNameKey, CNContactFamilyNameKey, CNContactPhoneNumbersKey, CNContactJobTitleKey, CNContactThumbnailImageDataKey, CNContactImageDataAvailableKey, CNContactImageDataKey] as [CNKeyDescriptor]

        // Get the identifier for the user's own contact card
        let ownContactIdentifier = CNContactStore().defaultContainerIdentifier()

        do {
            let ownContact = try store.unifiedContact(withIdentifier: ownContactIdentifier, keysToFetch: keysToFetch)

            if let data = ownContact.imageData {
                call.resolve([
                    "imageData": data.base64EncodedString()
                ])
            } else {
                call.reject("No profile picture data found")
            }
        } catch {
            call.reject("Error fetching your own contact card: \(error)")
        }
    }






}
