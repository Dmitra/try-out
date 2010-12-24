#!/usr/bin/env rspec
#gem install rspec

class Checkout
  def new
    @basket = []
  end

  def initialize(rules)
    new()
    @rules = rules 
  end

  def scan(code)
    item = Product.new(code)
    @rules.map{|rule| rule.call(@basket, item)}
    @basket << item
  end

  #return float price
  def total
    @basket.inject(0) {|sum, item| sum + item.price}
  end

end

class Product

  attr_reader :code, :name
  attr_accessor :price

  def initialize(code)
    @code = code
    case code
      when "FR1"
        @name = "Fruit tea"
        @price = 3.11
      when "SR1"
        @name = "Strawberries"
        @price = 5.00
      else
        @name = "Coffee"
        @price = 11.23
    end
  end
end

bogof = lambda do |basket, item|
  if item.code == "FR1" &&
       basket.map {|i| i if i.code == "FR1"}.compact.count.odd?
    item.price = 0
  end
end

bulk = lambda do |basket, item|
  if item.code == "SR1"
    strawberries_count = basket.map {|i| i if i.code == "SR1"}.compact.count
    if strawberries_count == 2
      basket.map! {|i| i.price = 4.5 if i.code == "SR1"; i}
      item.price = 4.5
    elsif strawberries_count > 2
      item.price = 4.5
    end
  end
end

rules = [bogof, bulk]
co = Checkout.new(rules)


#Tests
describe "check total price for rules:" do
  before(:all) do
  end

  before(:each) do
    co.new
  end

  it "only bogof & should affect once" do
    basket1 = %w(FR1 SR1 FR1 FR1 CF1)
    basket1.each{|item| co.scan(item) }
    co.total.should == 22.45
  end

  it "only bogof affects" do
    basket2 = %w(FR1 FR1)
    basket2.each{|item| co.scan(item) }
    co.total.should == 3.11
  end

  it "only bulk affects" do
    basket3 = %w(SR1 SR1 FR1 SR1)
    basket3.each{|item| co.scan(item) }
    co.total.should == 16.61
  end
end
