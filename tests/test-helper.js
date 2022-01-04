import * as QUnit from "qunit";
import { setup } from "qunit-dom";
import { setApplication } from "@ember/test-helpers";
import { start } from "ember-qunit";
import setupSinon from "ember-sinon-qunit";
import * as QUnit from "qunit";
import { setup } from "qunit-dom";

import Application from "../app";
import config from "../config/environment";

setup(QUnit.assert);

setApplication(Application.create(config.APP));

setupSinon();

start();
