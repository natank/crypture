import { Request, Response, NextFunction } from 'express';
import { getCsrfToken, validateCsrfToken } from '../../src/middleware/csrf-middleware';

function makeMockRes(): Partial<Response> {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    locals: {},
  };
  return res;
}

function makeMockReq(overrides: Partial<Request> = {}): Partial<Request> {
  return {
    method: 'POST',
    headers: {},
    body: {},
    ...overrides,
  };
}

describe('getCsrfToken', () => {
  it('should return a CSRF token and set a cookie', () => {
    const req = makeMockReq({ method: 'GET' });
    const res = makeMockRes();

    getCsrfToken(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ csrfToken: expect.any(String) }),
      })
    );
    expect(res.cookie).toHaveBeenCalledWith(
      'csrf-token',
      expect.any(String),
      expect.objectContaining({ httpOnly: false, sameSite: 'strict' })
    );
  });

  it('should return a 64-character hex token', () => {
    const req = makeMockReq({ method: 'GET' });
    const res = makeMockRes();

    getCsrfToken(req as Request, res as Response);

    const call = (res.json as jest.Mock).mock.calls[0][0];
    expect(call.data.csrfToken).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('validateCsrfToken', () => {
  const next: NextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass for GET requests without a token', () => {
    const req = makeMockReq({ method: 'GET' });
    const res = makeMockRes();

    validateCsrfToken(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should pass for HEAD requests without a token', () => {
    const req = makeMockReq({ method: 'HEAD' });
    const res = makeMockRes();

    validateCsrfToken(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should reject POST without a token', () => {
    const req = makeMockReq({ method: 'POST', headers: {}, body: {} });
    const res = makeMockRes();

    validateCsrfToken(req as Request, res as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'CSRF token missing' })
    );
  });

  it('should reject POST with an invalid token', () => {
    const req = makeMockReq({
      method: 'POST',
      headers: { 'x-csrf-token': 'invalid-token-that-was-never-issued' },
    });
    const res = makeMockRes();

    validateCsrfToken(req as Request, res as Response, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Invalid CSRF token' })
    );
  });

  it('should accept POST with a valid token from getCsrfToken', () => {
    // Issue a token first
    const getReq = makeMockReq({ method: 'GET' });
    const getRes = makeMockRes();
    getCsrfToken(getReq as Request, getRes as Response);
    const issuedToken = (getRes.json as jest.Mock).mock.calls[0][0].data.csrfToken;

    // Use it in a POST
    const postReq = makeMockReq({
      method: 'POST',
      headers: { 'x-csrf-token': issuedToken },
    });
    const postRes = makeMockRes();

    validateCsrfToken(postReq as Request, postRes as Response, next);

    expect(next).toHaveBeenCalled();
    expect(postRes.status).not.toHaveBeenCalled();
  });

  it('should reject reuse of a single-use token', () => {
    // Issue a token
    const getReq = makeMockReq({ method: 'GET' });
    const getRes = makeMockRes();
    getCsrfToken(getReq as Request, getRes as Response);
    const issuedToken = (getRes.json as jest.Mock).mock.calls[0][0].data.csrfToken;

    // Use it once - should pass
    const postReq1 = makeMockReq({
      method: 'POST',
      headers: { 'x-csrf-token': issuedToken },
    });
    validateCsrfToken(postReq1 as Request, makeMockRes() as Response, next);
    expect(next).toHaveBeenCalledTimes(1);

    // Use it again - should fail (single-use)
    jest.clearAllMocks();
    const postReq2 = makeMockReq({
      method: 'POST',
      headers: { 'x-csrf-token': issuedToken },
    });
    const postRes2 = makeMockRes();
    validateCsrfToken(postReq2 as Request, postRes2 as Response, next);
    expect(next).not.toHaveBeenCalled();
    expect(postRes2.status).toHaveBeenCalledWith(403);
  });

  it('should accept token from request body _csrf field', () => {
    const getReq = makeMockReq({ method: 'GET' });
    const getRes = makeMockRes();
    getCsrfToken(getReq as Request, getRes as Response);
    const issuedToken = (getRes.json as jest.Mock).mock.calls[0][0].data.csrfToken;

    const postReq = makeMockReq({
      method: 'POST',
      headers: {},
      body: { _csrf: issuedToken },
    });
    const postRes = makeMockRes();

    validateCsrfToken(postReq as Request, postRes as Response, next);

    expect(next).toHaveBeenCalled();
  });
});
