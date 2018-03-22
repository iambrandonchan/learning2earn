# -*- coding: utf-8 -*-
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
from pyvirtualdisplay import Display


class UntitledTestCase(unittest.TestCase):
    def setUp(self):
        self.display = Display(visible=0, size=(1920, 1080))
        self.display.start()
        self.driver = webdriver.Chrome('../linux_chrome')
        self.driver.implicitly_wait(30)
        self.base_url = "https://www.katalon.com/"
        self.verificationErrors = []
        self.accept_next_alert = True
    
    def test_untitled_test_case(self):
        driver = self.driver
        driver.get("http://www.learning2earn.me/")
        driver.find_element_by_link_text("Jobs").click()
        driver.find_element_by_link_text("Android Developer").click()
        driver.find_element_by_link_text("Blockchain and Bitcoin Fundamentals").click()
        driver.find_element_by_link_text("Jobs").click()
        driver.find_element_by_link_text("Backend Developer").click()
        driver.find_element_by_link_text("Jobs").click()
        driver.find_element_by_link_text("Associate Director of User Experience").click()
        driver.find_element_by_link_text("R Programming: Advanced Analytics In R For Data Science").click()
        driver.find_element_by_link_text("Jobs").click()
        driver.find_element_by_link_text("next").click()
        driver.find_element_by_link_text("next").click()
        driver.find_element_by_link_text("next").click()
        driver.find_element_by_link_text("next").click()
        # ERROR: Caught exception [ERROR: Unsupported command [doubleClick | link=next | ]]
        driver.find_element_by_link_text("previous").click()
        # ERROR: Caught exception [ERROR: Unsupported command [doubleClick | link=previous | ]]
        driver.find_element_by_link_text("Jobs").click()
    
    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True
    
    # def is_alert_present(self):
    #     try: self.driver.switch_to_alert()
    #     except NoAlertPresentException as e: return False
    #     return True
    
    # def close_alert_and_get_its_text(self):
    #     try:
    #         alert = self.driver.switch_to_alert()
    #         alert_text = alert.text
    #         if self.accept_next_alert:
    #             alert.accept()
    #         else:
    #             alert.dismiss()
    #         return alert_text
    #     finally: self.accept_next_alert = True
    
    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

if __name__ == "__main__":
    unittest.main()
