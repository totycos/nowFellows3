class User < ApplicationRecord
  has_many :messages
  has_many :conversations, foreign_key: :sender_id
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable

  validates :name, :surname, presence: true, uniqueness: {case_sensitive: false}

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable

  devise :omniauthable, :omniauth_providers => [:linkedin]

  def self.from_omniauth(auth)
  where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
    user.email = auth.info.email
    user.password = Devise.friendly_token[0,20]
    #user.name = auth.info.name   # assuming the user model has a name
    #user.image = auth.info.image # assuming the user model has an image
    # If you are using confirmable and the provider(s) you use validate emails,
    # uncomment the line below to skip the confirmation emails.
    # user.skip_confirmation!
    end
  end

  def self.from_linkedin(auth)

    where(linkedin_id: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.last_name
      user.surname = auth.info.first_name
      user.provider = auth.provider
      user.uid = auth.uid
      user.password = Devise.friendly_token[0, 20]
      user.skip_confirmation!
    end

  end




end
