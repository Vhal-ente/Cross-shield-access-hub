import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { faker } from '@faker-js/faker'
import User from '#models/user'
import Role from '#models/role'
import Beneficiary from '#models/beneficiary'

export default class DiasporaSeeder extends BaseSeeder {
  public static developmentOnly = true

  private nigerianCities = [
    'Lagos, Nigeria',
    'Abuja, Nigeria',
    'Port Harcourt, Nigeria',
    'Kano, Nigeria',
    'Ibadan, Nigeria',
    'Enugu, Nigeria',
  ]

  private genNgPhone() {
    return '080' + faker.number.int({ min: 10000000, max: 99999999 }).toString()
  }

  private genIntlPhone() {
    return faker.phone.number({ style: 'international' })
  }

  public async run() {
    const diasporaRole = await Role.findByOrFail('name', 'diaspora')

    const DIASPORA_COUNT = 5

    for (let i = 0; i < DIASPORA_COUNT; i++) {
      const fullName = faker.person.fullName()
      const [first, last = ''] = fullName.split(' ')
      const email = faker.internet.email({ firstName: first, lastName: last }).toLowerCase()

      const isNigerian = faker.helpers.arrayElement([true, false])

      const diaspora = await User.firstOrCreate(
        { email },
        {
          fullName,
          email,
          phone: isNigerian ? this.genNgPhone() : this.genIntlPhone(),
          password: 'Password123!',
          roleId: diasporaRole.id,
          status: 'active',
          location: isNigerian
            ? faker.helpers.arrayElement(this.nigerianCities)
            : `${faker.location.city()}, ${faker.location.country()}`,
        }
      )

      const beneficiaryCount = faker.number.int({ min: 2, max: 4 })

      for (let j = 0; j < beneficiaryCount; j++) {
        const benName = faker.person.fullName()
        const [bFirst, bLast = ''] = benName.split(' ')
        const benEmail = faker.internet.email({ firstName: bFirst, lastName: bLast }).toLowerCase()

        await Beneficiary.firstOrCreate(
          { email: benEmail },
          {
            diasporaId: diaspora.id,
            name: benName,
            phone: this.genNgPhone(), // beneficiaries stay Nigerian
            email: benEmail,
            location: faker.helpers.arrayElement(this.nigerianCities),
            medicationNeeds: faker.helpers.arrayElement([
              'Hypertension meds',
              'Diabetes meds',
              'Asthma inhaler',
              'Ulcer therapy',
              'Analgesics',
            ]),
            status: 'active',
            referred: false,
            referralNote: null,
            referredAt: null,
          }
        )
      }
    }
  }
}
