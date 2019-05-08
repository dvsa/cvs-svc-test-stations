const HTTPError = require('../models/HTTPError')
const AWSXRay = require('aws-xray-sdk-core')

// AWSXRay.enableManualMode()

class TestStationService {
  constructor (testStationDAO) {
    this.testStationDAO = testStationDAO
  }

  getTestStationList () {
    let retrievedSegment = AWSXRay.getSegment();
    if(typeof retrievedSegment === 'undefined') retrievedSegment = new AWSXRay.Segment('hello');

    console.log('TEST SEGMENT QWERTY',retrievedSegment)
    // const segment = new AWSXRay.Segment('hello')
    retrievedSegment.addAnnotation('retrieved segment', JSON.stringify(retrievedSegment))

    return this.testStationDAO.getAll()
      .then(data => {
        if (data.Count === 0) {
          throw new HTTPError(404, 'No resources match the search criteria.')
        }
        retrievedSegment.addAnnotation("stations", JSON.stringify(data))
        return data.Items
      })
      .catch(error => {
        retrievedSegment.addError(error);
        if (!(error instanceof HTTPError)) {
          console.log('thrown error', error, 'END of error')
          error.statusCode = 500
          error.body = 'Internal Server Error'
        }
        throw new HTTPError(error.statusCode, error.body)
      })
  }

  insertTestStationList (testStationItems) {
    return this.testStationDAO.createMultiple(testStationItems)
      .then(data => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal Server Error')
        }
      })
  }

  deleteTestStationsList (testStationItemsKeys) {
    return this.testStationDAO.deleteMultiple(testStationItemsKeys)
      .then((data) => {
        if (data.UnprocessedItems) { return data.UnprocessedItems }
      })
      .catch((error) => {
        if (error) {
          console.error(error)
          throw new HTTPError(500, 'Internal Server Error')
        }
      })
  }
}

module.exports = TestStationService
