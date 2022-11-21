// Copyright 2022 RoyTimes/d-im-sandbox authors & contributors
// SPDX-License-Identifier: GPL-3.0

export type Message = {
  from: string, 
  to: string, 
  message: string,
}

export type MessageWithId = {
  from: string, 
  to: string, 
  message: string,
  id: string
}