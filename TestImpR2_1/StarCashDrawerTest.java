// StarCashDrawerTest.java
// This file contains sample code illustrating how to use the CashDrawer class to
// control your cash drawer.  The basic control and status querying mechanisms
// are used here.  For more advanced usage of the CashDrawer class, see the 
// JavaPOS specification.

// usage instructions - Windows
// 1. compile from command line - javac -classpath jpos113-controls.jar;jcl.jar StarCashDrawerTest.java
// 2. execute from command line - java -classpath .;starjavapos.jar;stario.jar;jpos113-controls.jar;jcl.jar;xercesimpl.jar;xml-apis.jar StarCashDrawerTest

// usage instructions - Linux and Mac OS X
// 1. compile from command line - javac -classpath jpos113-controls.jar:jcl.jar StarCashDrawerTest.java
// 2. execute from command line - java -classpath .:starjavapos.jar:stario.jar:jpos113-controls.jar:jcl.jar:xercesimpl.jar:xml-apis.jar StarCashDrawerTest

// NOTE: CHANGE THE CASH DRAWER NAME IN THE cashDrawer.open STATEMENT BELOW TO MATCH YOUR CONFIGURED DEVICE NAME

import jpos.CashDrawer;
import jpos.CashDrawerConst;
import jpos.JposException;
import jpos.events.StatusUpdateEvent;
import jpos.events.StatusUpdateListener;
import jpos.util.JposPropertiesConst;

public class StarCashDrawerTest implements StatusUpdateListener {
	public void statusUpdateOccurred(StatusUpdateEvent e) {
		int drawerStatus = e.getStatus();

		if (drawerStatus == CashDrawerConst.CASH_SUE_DRAWEROPEN) {
			System.out.println("StatusUpdateEvent received : drawer opened.");
		} else if (drawerStatus == CashDrawerConst.CASH_SUE_DRAWERCLOSED) {
			System.out.println("StatusUpdateEvent received : drawer closed.");
		}
	}

	public void runTest(String[] args) {
		/*
		 * If you want to place the jpos.xml file elsewhere on your local file
		 * system then uncomment the following line and specify the full path to
		 * jpos.xml.
		 * 
		 * If you want to place the jpos.xml file on a web server for access over
		 * the internet then uncomment the second System.setProperty line below
		 * and specify the full URL to jpos.xml.
		 */
		System.setProperty(JposPropertiesConst.JPOS_POPULATOR_FILE_PROP_NAME, "jpos.xml");
		// System.setProperty(JposPropertiesConst.JPOS_POPULATOR_FILE_URL_PROP_NAME, "http://some-where-remote.com/jpos.xml");

		// instantiate a new jpos.CashDrawer object
		CashDrawer cashDrawer = new CashDrawer();

		try {
			cashDrawer.addStatusUpdateListener(this);

			// open the cashDrawer object according to the entry names defined in jpos.xml
			cashDrawer.open("default");

			// claim exclusive usage of the cashDrawer object
			cashDrawer.claim(1);

			// enable the device for input and output
			cashDrawer.setDeviceEnabled(true);

			// check if the drawer is currently opened
			// if this check returns true when the drawer is ACTUALLY CLOSED,
			// set the drawerClosedOnSignalLow property of this device's entry
			// in the jpos.xml file to true
			boolean drawerOpenedStatus = cashDrawer.getDrawerOpened();
			if (drawerOpenedStatus == true) {
				System.out.println("cashDrawer.getDrawerOpened() == true");
			} else {
				System.out.println("cashDrawer.getDrawerOpened() == false");
			}

			// open the cash drawer
			// if your cash drawer is wired to the printer's control circuit
			// number 2, set the cashDrawer1 property of this device's entry in
			// jpos.xml file to true
			cashDrawer.openDrawer();

			if (drawerOpenedStatus != cashDrawer.getDrawerOpened()) {
				System.out.println("Drawer opened successfully");
			} else {
				System.out.println("Drawer status remains the same after openDrawer() call");
			}

			// just wait for 5000ms to watch StatusUpdateEvent
			try {
				Thread.sleep(5000);
			} catch (Exception e) {
			}
		} catch (JposException e) {
			// display any errors that come up
			e.printStackTrace();
		} finally {
			// close the cashDrawer object
			try {
				cashDrawer.close();
			} catch (Exception e) {
			}
		}

		System.out.println("StarCashDrawerTest finished.");
		System.exit(0);
	}

	public static void main(String[] args) {
		new StarCashDrawerTest().runTest(args);
	}
}
