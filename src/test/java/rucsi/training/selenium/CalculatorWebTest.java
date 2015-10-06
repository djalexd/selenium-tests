package rucsi.training.selenium;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class CalculatorWebTest {

	@BeforeClass
	public static void setupChromeDriverProperties() {
		System.setProperty("webdriver.chrome.driver", "/Users/alexdobjanschi/bin/chromedriver");
	}

	private WebDriver webDriver;

	@Before
	public void setupWebDriverBeforeTest() {
		webDriver = new ChromeDriver();
	}

	@After
	public void tearDownWebDriverAfterTest() {
		webDriver.quit();
	}

	@Test
	public void shouldGetOkResultWhenReadingIndex() {
		// given
		// when
		webDriver.get("http://localhost:3000/index.html");
		// then
	}

	@Test
	public void shouldDisplayZeroByDefaultWhenReadingIndex() {
		// given
		webDriver.get("http://localhost:3000/index.html");
		// when
		// then
		WebElement displayElement = webDriver.findElement(By.id("display"));
		Assert.assertEquals("0", displayElement.getAttribute("value"));
	}

	@Test
	public void shouldDisplayDigitsWhenClicked() {
		// given
		webDriver.get("http://localhost:3000/index.html");
		// when
		WebElement someDigit = webDriver.findElement(By.cssSelector(".digit"));
		someDigit.click();
		someDigit.click();
		// then
		WebElement displayElement = webDriver.findElement(By.id("display"));
		Assert.assertEquals("11", displayElement.getAttribute("value"));
	}

	@Test
	public void shouldCalculateCorrectlyWhenClickingEq() {
		// given
		webDriver.get("http://localhost:3000/index.html");
		// when
		WebElement displayElement = webDriver.findElement(By.id("display"));
		displayElement.sendKeys("12.65 + 2.1 * 6.4 - 2.0");
		// then
		WebElement eqElement = webDriver.findElement(By.id("compute"));
		eqElement.click();

		Assert.assertEquals("24.09", displayElement.getAttribute("value"));
	}
}
