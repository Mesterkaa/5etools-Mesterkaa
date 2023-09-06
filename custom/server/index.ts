import * as express from 'express';
import * as http from 'http';

import * as mongoose from 'mongoose';

import {logger} from "./config/logger"
import { MONGODB_URI, PORT } from "./config/secrets";
